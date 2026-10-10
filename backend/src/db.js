import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS participants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    answers JSON NOT NULL,
    feature_vector JSON NOT NULL,
    table_number INTEGER,
    device_id TEXT UNIQUE,
    status TEXT NOT NULL,
    waitlist_position INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
