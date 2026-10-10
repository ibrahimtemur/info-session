import db from '../db.js';
import { buildVector, placeLatecomer, rebalance as matchingRebalance, TABLE_CAPACITY } from '../shared/matching.js';
import { v4 as uuidv4 } from 'uuid';

export class SeatingError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'SeatingError';
    this.code = code;
    this.details = details;
  }
}

export function getActiveState() {
  const participants = db.prepare(`SELECT * FROM participants ORDER BY created_at ASC`).all();
  
  const tablesMap = new Map();
  const waitlist = [];
  
  for (const row of participants) {
    const member = {
      id: row.id,
      name: row.name,
      vec: JSON.parse(row.feature_vector),
      answers: JSON.parse(row.answers),
      created_at: row.created_at
    };
    
    if (row.status === 'seated' && row.table_number !== null) {
      if (!tablesMap.has(row.table_number)) {
        tablesMap.set(row.table_number, { id: row.table_number, members: [] });
      }
      tablesMap.get(row.table_number).members.push(member);
    } else if (row.status === 'waitlist') {
      waitlist.push(member);
    }
  }
  
  return {
    tables: Array.from(tablesMap.values()),
    waitlist: waitlist
  };
}

export const addParticipant = db.transaction((name, answers, deviceId) => {
  if (deviceId) {
    const existing = db.prepare('SELECT id FROM participants WHERE device_id = ?').get(deviceId);
    if (existing) {
      throw new SeatingError('already_registered', 'Bu cihaz zaten kayıtlı', { participantId: existing.id });
    }
  }

  const vec = buildVector(answers);
  const id = uuidv4();
  const person = { id, name, answers, vec };
  
  const currentState = getActiveState();
  const { result } = placeLatecomer(currentState, person);
  
  let status = result.status;
  let tableNumber = status === 'seated' ? result.tableId : null;
  let waitlistPosition = status === 'waitlist' ? result.position : null;
  
  db.prepare(`
    INSERT INTO participants (id, name, answers, feature_vector, table_number, device_id, status, waitlist_position)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, JSON.stringify(answers), JSON.stringify(vec), tableNumber, deviceId || null, status, waitlistPosition);
  
  return id;
});

export const rebalanceAll = db.transaction(() => {
  const state = getActiveState();
  const options = { order: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime() };
  
  const newState = matchingRebalance(state, options);
  
  db.prepare('UPDATE participants SET table_number = NULL, status = \'waitlist\', waitlist_position = NULL').run();
  
  const updateStmt = db.prepare('UPDATE participants SET table_number = ?, status = \'seated\' WHERE id = ?');
  for (const t of newState.tables) {
    for (const m of t.members) {
      updateStmt.run(t.id, m.id);
    }
  }
  
  const waitlistStmt = db.prepare('UPDATE participants SET status = \'waitlist\', waitlist_position = ? WHERE id = ?');
  newState.waitlist.forEach((m, idx) => {
    waitlistStmt.run(idx + 1, m.id);
  });
  
  return newState;
});

export const resetDatabase = db.transaction(() => {
  db.prepare('DELETE FROM participants').run();
});

export const moveParticipant = db.transaction((personId, toTableId) => {
  const person = db.prepare('SELECT * FROM participants WHERE id = ?').get(personId);
  if (!person) {
    throw new SeatingError('not_found', 'Katılımcı bulunamadı');
  }

  const countInTable = db.prepare('SELECT count(*) as cnt FROM participants WHERE status = \'seated\' AND table_number = ?').get(toTableId).cnt;
  
  if (person.status === 'seated' && person.table_number === toTableId) {
    return;
  }

  if (countInTable >= TABLE_CAPACITY) {
    throw new SeatingError('table_full', `Hedef masa dolu`, { tableNumber: toTableId });
  }

  db.prepare('UPDATE participants SET table_number = ?, status = \'seated\', waitlist_position = NULL WHERE id = ?').run(toTableId, personId);
  
  if (person.status === 'waitlist') {
    const waitlist = db.prepare('SELECT id FROM participants WHERE status = \'waitlist\' ORDER BY waitlist_position ASC').all();
    const waitlistStmt = db.prepare('UPDATE participants SET waitlist_position = ? WHERE id = ?');
    waitlist.forEach((row, idx) => {
      waitlistStmt.run(idx + 1, row.id);
    });
  }
});
