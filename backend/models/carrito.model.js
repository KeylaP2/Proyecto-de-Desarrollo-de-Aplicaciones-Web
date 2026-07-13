const db = require("../database/connection");

const findByUsuarioId = (usuarioId) => new Promise((resolve, reject) => {
  db.get("SELECT items FROM carritos WHERE usuario_id = ?", [usuarioId], (error, row) => {
    if (error) return reject(error);
    if (!row) return resolve([]);
    try {
      const items = JSON.parse(row.items);
      return resolve(Array.isArray(items) ? items : []);
    } catch (parseError) {
      return reject(parseError);
    }
  });
});

const saveByUsuarioId = (usuarioId, items) => new Promise((resolve, reject) => {
  const sql = `
    INSERT INTO carritos (usuario_id, items, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(usuario_id) DO UPDATE SET
      items = excluded.items,
      updated_at = CURRENT_TIMESTAMP
  `;
  db.run(sql, [usuarioId, JSON.stringify(items)], function handleSave(error) {
    if (error) reject(error);
    else resolve({ changes: this.changes });
  });
});

module.exports = { findByUsuarioId, saveByUsuarioId };
