const db = require("../database/connection");

const find = (key) => new Promise((resolve, reject) => {
  db.get("SELECT attempts, first_attempt FROM login_attempts WHERE attempt_key = ?", [key], (error, row) => {
    if (error) reject(error);
    else resolve(row);
  });
});

const recordFailure = async (key, windowMs) => {
  const current = await find(key);
  const now = Date.now();
  const expired = !current || now - current.first_attempt >= windowMs;
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO login_attempts (attempt_key, attempts, first_attempt) VALUES (?, ?, ?)
      ON CONFLICT(attempt_key) DO UPDATE SET attempts = ?, first_attempt = ?`,
    [key, expired ? 1 : current.attempts + 1, expired ? now : current.first_attempt,
      expired ? 1 : current.attempts + 1, expired ? now : current.first_attempt], function complete(error) {
      if (error) reject(error);
      else resolve();
    });
  });
};

const clear = (key) => new Promise((resolve, reject) => {
  db.run("DELETE FROM login_attempts WHERE attempt_key = ?", [key], (error) => {
    if (error) reject(error);
    else resolve();
  });
});

module.exports = { find, recordFailure, clear };
