const db = require("../database/connection");

const findAll = () => {
  const sql = `
    SELECT id, nombre, email, created_at, updated_at
    FROM usuarios
    ORDER BY id DESC
  `;

  return new Promise((resolve, reject) => {
    db.all(sql, [], (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
};

const findById = (id) => {
  const sql = `
    SELECT id, nombre, email, created_at, updated_at
    FROM usuarios
    WHERE id = ?
  `;

  return new Promise((resolve, reject) => {
    db.get(sql, [id], (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
};

const create = ({ nombre, email, password }) => {
  const sql = `
    INSERT INTO usuarios (nombre, email, password)
    VALUES (?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
    db.run(sql, [nombre, email, password], function handleInsert(error) {
      if (error) reject(error);
      else resolve({ id: this.lastID, nombre, email });
    });
  });
};

const update = (id, { nombre, email, password }) => {
  const sql = `
    UPDATE usuarios
    SET nombre = ?, email = ?, password = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  return new Promise((resolve, reject) => {
    db.run(sql, [nombre, email, password, id], function handleUpdate(error) {
      if (error) reject(error);
      else resolve({ changes: this.changes });
    });
  });
};

const remove = (id) => {
  const sql = "DELETE FROM usuarios WHERE id = ?";

  return new Promise((resolve, reject) => {
    db.run(sql, [id], function handleDelete(error) {
      if (error) reject(error);
      else resolve({ changes: this.changes });
    });
  });
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
