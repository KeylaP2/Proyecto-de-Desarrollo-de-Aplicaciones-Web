const db = require("../database/connection");

const findByEmailWithPassword = (email) => new Promise((resolve, reject) => {
  db.get(`
    SELECT id, email, password, role, activo
    FROM administradores
    WHERE lower(email) = lower(?)
  `, [email], (error, row) => {
    if (error) reject(error);
    else resolve(row);
  });
});

module.exports = { findByEmailWithPassword };
