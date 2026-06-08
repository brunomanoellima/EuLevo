const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'eulevo.db');

function openDatabase() {
  fs.mkdirSync(dataDir, { recursive: true });
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  return db;
}

function initDatabase(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS participants (
      event_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      PRIMARY KEY (event_id, user_id),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      assigned_user_id TEXT,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS invitations (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      email TEXT NOT NULL,
      invited_user_id TEXT NOT NULL,
      invited_by_user_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (invited_user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (invited_by_user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_participants_user ON participants(user_id);
    CREATE INDEX IF NOT EXISTS idx_items_event ON items(event_id);
    CREATE INDEX IF NOT EXISTS idx_messages_event ON messages(event_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_event ON notifications(event_id);
    CREATE INDEX IF NOT EXISTS idx_invitations_user ON invitations(invited_user_id);
  `);
}

module.exports = {
  dbPath,
  initDatabase,
  openDatabase,
};
