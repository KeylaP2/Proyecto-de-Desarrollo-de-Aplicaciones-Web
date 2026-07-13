const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();

class SQLiteSessionStore extends session.Store {
  constructor({ filename, ttlMs }) {
    super();
    this.ttlMs = ttlMs;
    this.db = new sqlite3.Database(filename);
    this.db.run("CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, data TEXT NOT NULL, expires_at INTEGER NOT NULL)");
    this.cleanupTimer = setInterval(() => {
      this.db.run("DELETE FROM sessions WHERE expires_at <= ?", [Date.now()]);
    }, 15 * 60 * 1000);
    this.cleanupTimer.unref();
  }

  get(sid, callback) {
    this.db.get("SELECT data, expires_at FROM sessions WHERE sid = ?", [sid], (error, row) => {
      if (error) return callback(error);
      if (!row || row.expires_at <= Date.now()) {
        if (row) this.destroy(sid, () => {});
        return callback(null, null);
      }
      try {
        return callback(null, JSON.parse(row.data));
      } catch (parseError) {
        return callback(parseError);
      }
    });
  }

  set(sid, sessionData, callback = () => {}) {
    const expiresAt = sessionData.cookie?.expires ? new Date(sessionData.cookie.expires).getTime() : Date.now() + this.ttlMs;
    this.db.run(`INSERT INTO sessions (sid, data, expires_at) VALUES (?, ?, ?)
      ON CONFLICT(sid) DO UPDATE SET data = excluded.data, expires_at = excluded.expires_at`,
    [sid, JSON.stringify(sessionData), expiresAt], callback);
  }

  destroy(sid, callback = () => {}) {
    this.db.run("DELETE FROM sessions WHERE sid = ?", [sid], callback);
  }

  touch(sid, sessionData, callback = () => {}) {
    const expiresAt = sessionData.cookie?.expires ? new Date(sessionData.cookie.expires).getTime() : Date.now() + this.ttlMs;
    this.db.run("UPDATE sessions SET expires_at = ? WHERE sid = ?", [expiresAt, sid], callback);
  }
}

module.exports = SQLiteSessionStore;
