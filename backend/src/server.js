import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// Yerelde backend/.env okunur; Vercel ortamında ortam değişkenleri panelinden gelir.
if (!process.env.VERCEL) {
  dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });
}

import participantsRouter from './routes/participants.js';
import tablesRouter from './routes/tables.js';
import adminRouter from './routes/admin.js';

const app = express();
const port = process.env.PORT || 3000;

// Güvenlik: Sunucu kimliğini gizle (fingerprinting koruması)
app.disable('x-powered-by');

// Vercel/Render gibi proxy arkasında gerçek istemci IP'si (rate limit için) doğru okunsun
app.set('trust proxy', 1);

// Güvenlik başlıkları (Security Headers)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Vercel'de frontend ve API aynı alan adında olduğundan CORS gerekmez.
// Yerel geliştirme veya ayrı alan adı için FRONTEND_ORIGIN (virgülle ayrılmış) tanımlanabilir.
if (process.env.FRONTEND_ORIGIN) {
  app.use(cors({ origin: process.env.FRONTEND_ORIGIN.split(',').map((s) => s.trim()) }));
}

// DoS saldırılarına karşı gövde boyutunu 100kb ile sınırla
app.use(express.json({ limit: '100kb' }));

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

if (process.env['NODE_ENV'] !== 'test' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
  });
}

export default app;
