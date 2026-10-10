import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import participantsRouter from './routes/participants.js';
import tablesRouter from './routes/tables.js';
import adminRouter from './routes/admin.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5180',
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/participants', participantsRouter);
app.use('/api/tables', tablesRouter);
app.use('/api/admin', adminRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: { code: 'server_error', message: 'Sunucu hatası' } });
});

if (process.env['NODE_ENV'] !== 'test') {
  app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
  });
}

export default app;
