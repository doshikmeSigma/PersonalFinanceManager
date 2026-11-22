import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './index.js';

const migrationsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations');

db.exec(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const applied = new Set(
  db.prepare('SELECT name FROM schema_migrations').all().map((row) => row.name)
);

const files = fs.existsSync(migrationsDir)
  ? fs.readdirSync(migrationsDir).filter((file) => file.endsWith('.sql')).sort()
  : [];

const pending = files.filter((file) => !applied.has(file));

if (pending.length === 0) {
  console.log('[migrate] новых миграций нет');
}

for (const file of pending) {
  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  db.exec('BEGIN');
  try {
    db.exec(sql);
    db.prepare('INSERT INTO schema_migrations (name) VALUES (?)').run(file);
    db.exec('COMMIT');
    console.log(`[migrate] применена ${file}`);
  } catch (error) {
    db.exec('ROLLBACK');
    console.error(`[migrate] ошибка в ${file}`);
    throw error;
  }
}

db.close();