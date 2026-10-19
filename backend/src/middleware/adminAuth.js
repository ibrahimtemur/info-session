import crypto from 'crypto';

/**
 * Zamanlama saldırılarını (timing attack) önlemek için sabit zamanlı string karşılaştırması.
 */
export function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || !a || !b) {
    return false;
  }
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export default function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: { code: 'unauthorized', message: 'Admin token yok veya geçersiz' } });
  }
  const token = authHeader.split(' ')[1];

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(500).json({ error: { code: 'server_error', message: 'Sunucu yapılandırma hatası: ADMIN_PASSWORD tanımlı değil' } });
  }

  const expectedToken = `admin-token-${adminPassword}`;
  if (!safeCompare(token, expectedToken)) {
    return res.status(401).json({ error: { code: 'unauthorized', message: 'Geçersiz token' } });
  }
  next();
}

