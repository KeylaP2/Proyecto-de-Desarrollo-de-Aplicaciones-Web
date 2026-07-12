const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { dbFile } = require("../config/env");

const databasePath = path.resolve(__dirname, "..", dbFile);

const db = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error("Error al conectar con SQLite:", error.message);
    return;
  }

  console.log(`Conexion SQLite establecida: ${databasePath}`);
});

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");
  db.run(`
    CREATE TABLE IF NOT EXISTS carritos (
      usuario_id INTEGER PRIMARY KEY,
      items TEXT NOT NULL DEFAULT '[]',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      attempt_key TEXT PRIMARY KEY,
      attempts INTEGER NOT NULL DEFAULT 1,
      first_attempt INTEGER NOT NULL
    )
  `);
});

module.exports = db;
