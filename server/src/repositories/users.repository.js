import { db } from '../db/index.js';

const publicColumns = 'id, email, name, created_at, updated_at';

function findById(id) {
  return db.prepare(`SELECT ${publicColumns} FROM users WHERE id = ?`).get(id);
}

function findByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

function create({ email, passwordHash, name }) {
  const result = db
    .prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)')
    .run(email, passwordHash, name);

  return findById(Number(result.lastInsertRowid));
}

export const usersRepository = {
  findById,
  findByEmail,
  create,
};