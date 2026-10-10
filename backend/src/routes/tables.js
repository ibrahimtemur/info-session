import { Router } from 'express';
import db from '../db.js';
import { getActiveState } from '../services/placement.js';
import { tableTheme, TABLE_CAPACITY, MAX_SEATS } from '../shared/matching.js';

const router = Router();

router.get('/', (req, res, next) => {
  try {
    const state = getActiveState();
    
    const tables = state.tables.map(t => ({
      number: t.id,
      capacity: TABLE_CAPACITY,
      count: t.members.length,
      theme: tableTheme(t),
      members: t.members.map(m => ({ id: m.id, name: m.name }))
    }));
    
    const waitlist = state.waitlist.map((m, i) => ({
      id: m.id,
      name: m.name,
      position: i + 1
    }));
    
    const seatedCount = tables.reduce((acc, t) => acc + t.count, 0);
    const totals = {
      participants: seatedCount + waitlist.length,
      seated: seatedCount,
      waitlisted: waitlist.length,
      tableCount: tables.length,
      capacity: MAX_SEATS,
      occupancy: MAX_SEATS > 0 ? seatedCount / MAX_SEATS : 0
    };
    
    res.json({ tables, waitlist, totals });
  } catch (err) {
    next(err);
  }
});

export default router;
