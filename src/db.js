const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const { DATABASE_URL } = require('./config');

let db;

if (DATABASE_URL.startsWith('sqlite:')) {
  const dbPath = DATABASE_URL.replace('sqlite:', '');
  db = new sqlite3.Database(dbPath);
} else {
  db = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
}

const isSQLite = DATABASE_URL.startsWith('sqlite:');

// Initialize tables
const initDb = async () => {
  if (isSQLite) {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'employee',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        item_description TEXT NOT NULL,
        amount_cents INTEGER NOT NULL,
        commission_cents INTEGER NOT NULL,
        timestamp DATETIME NOT NULL,
        photo_path TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS login_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        success BOOLEAN NOT NULL,
        ip_address TEXT NOT NULL,
        attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);
    });
  } else {
    const client = await db.connect();
    try {
      await client.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'employee',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      await client.query(`CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        item_description TEXT NOT NULL,
        amount_cents INTEGER NOT NULL,
        commission_cents INTEGER NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        photo_path TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      await client.query(`CREATE TABLE IF NOT EXISTS login_attempts (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        success BOOLEAN NOT NULL,
        ip_address TEXT NOT NULL,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    } finally {
      client.release();
    }
  }
};

module.exports = { db, initDb, isSQLite };