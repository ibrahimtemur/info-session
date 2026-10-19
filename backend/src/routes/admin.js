import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { query } from '../db.js';
import adminAuth, { safeCompare } from '../middleware/adminAuth.js';
import { rebalanceAll, resetDatabase, moveParticipant, seedParticipants, SeatingError } from '../services/placement.js';
import { tableTheme, iceBreaker, TABLE_CAPACITY, MAX_SEATS } from '../shared/matching.js';

const router = Router();

// Brute-force saldırılarına karşı admin login rate limit'i
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: process.env['NODE_ENV'] === 'test' ? 1000 : 10, // test ortamında gevşek, üretimde 15 dk'da 10 deneme
  message: { error: { code: 'rate_limit', message: 'Çok fazla başarısız giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, (req, res, next) => {
  try {
    const { password } = req.body || {};
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return res.status(500).json({ error: { code: 'server_error', message: 'Sunucu yapılandırma hatası: ADMIN_PASSWORD tanımlı değil' } });
    }

    if (typeof password === 'string' && safeCompare(password, adminPassword)) {
      res.json({ token: `admin-token-${password}` });
    } else {
      res.status(401).json({ error: { code: 'unauthorized', message: 'Hatalı parola' } });
    }
  } catch (err) {
    next(err);
  }
});

router.use(adminAuth);


router.post('/rebalance', async (req, res, next) => {
  try {
    const newState = await rebalanceAll();
    
    const tables = newState.tables
      .map(t => ({
        number: t.id,
        capacity: TABLE_CAPACITY,
        count: t.members.length,
        theme: tableTheme(t),
        members: t.members.map(m => ({ id: m.id, name: m.name }))
      }))
      .sort((a, b) => a.number - b.number);
    
    const waitlist = newState.waitlist.map((m, i) => ({
      id: m.id,
      name: m.name,
      position: i + 1
    }));
    
    const waiting = (newState.waiting || []).map(m => ({
      id: m.id,
      name: m.name
    }));

    const seatedCount = tables.reduce((acc, t) => acc + t.count, 0);
    const totals = {
      participants: seatedCount + waitlist.length + waiting.length,
      seated: seatedCount,
      waitlisted: waitlist.length,
      waiting: waiting.length,
      tableCount: tables.length,
      capacity: MAX_SEATS,
      occupancy: MAX_SEATS > 0 ? seatedCount / MAX_SEATS : 0
    };
    
    res.json({ status: 'ok', tables, waitlist, waiting, totals });
  } catch (err) {
    next(err);
  }
});

router.post('/reset', async (req, res, next) => {
  try {
    await resetDatabase();
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
});

router.post('/seed', async (req, res, next) => {
  try {
    const count = typeof req.body?.count === 'number' && req.body.count > 0 ? Math.min(req.body.count, 72) : 30;
    const added = await seedParticipants(count);
    res.json({ status: 'ok', added });
  } catch (err) {
    next(err);
  }
});

router.get('/export.csv', async (req, res, next) => {
  try {
    const participants = (await query('SELECT * FROM participants ORDER BY seq ASC')).rows;
    
    const escape = (val) => {
      if (val == null) return '';
      let str = String(val);
      if (/^[@=+\-]/.test(str)) str = "'" + str;
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };
    
    let csv = '\uFEFF'; // BOM
    csv += 'id,name,status,table_number,waitlist_position,joined_at,crowd,starter,interests,style,goal,dept,friday,drink\r\n';
    
    for (const p of participants) {
      const a = p.answers;
      const interests = Array.isArray(a.interests) ? a.interests.join(';') : '';
      csv += `${escape(p.id)},${escape(p.name)},${escape(p.status)},${escape(p.table_number)},${escape(p.waitlist_position)},${escape(p.created_at instanceof Date ? p.created_at.toISOString() : p.created_at)},${escape(a.crowd)},${escape(a.starter)},${escape(interests)},${escape(a.style)},${escape(a.goal)},${escape(a.dept)},${escape(a.friday)},${escape(a.drink)}\r\n`;
    }
    
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

export default router;
