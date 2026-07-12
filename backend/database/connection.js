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

db.run("PRAGMA foreign_keys = ON");

module.exports = db;
