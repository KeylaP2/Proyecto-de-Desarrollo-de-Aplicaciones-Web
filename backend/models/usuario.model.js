const db = require("../database/connection");

const findAll = () => {
  const sql = `
    SELECT id, nombre, apellido, email, email AS correo, telefono, fecha_nacimiento, genero, created_at, updated_at
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
    SELECT id, nombre, apellido, email, email AS correo, telefono, fecha_nacimiento, genero, created_at, updated_at
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

const create = ({ nombre, apellido, email, telefono, fechaNacimiento, genero, password }) => {
  const sql = `
    INSERT INTO usuarios (nombre, apellido, email, telefono, fecha_nacimiento, genero, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
    db.run(sql, [nombre, apellido, email, telefono, fechaNacimiento, genero, password], function handleInsert(error) {
      if (error) reject(error);
      else {
        resolve({
          id: this.lastID,
          nombre,
          apellido,
          email,
          correo: email,
          telefono,
          fecha_nacimiento: fechaNacimiento,
          genero
        });
      }
    });
  });
};

const update = (id, { nombre, apellido, email, telefono, fechaNacimiento, genero, password }) => {
  const campos = [
    "nombre = ?",
    "apellido = ?",
    "email = ?",
    "telefono = ?",
    "fecha_nacimiento = ?",
    "genero = ?"
  ];
  const valores = [nombre, apellido, email, telefono, fechaNacimiento, genero];

  if (password) {
    campos.push("password = ?");
    valores.push(password);
  }

  campos.push("updated_at = CURRENT_TIMESTAMP");
  const sql = `UPDATE usuarios SET ${campos.join(", ")} WHERE id = ?`;
  valores.push(id);

  return new Promise((resolve, reject) => {
    db.run(sql, valores, function handleUpdate(error) {
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
