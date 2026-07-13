const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const db = require("./connection");
const { adminEmail, adminPassword } = require("../config/env");

const sqlFilePath = path.resolve(__dirname, "database.sql");
const sql = fs.readFileSync(sqlFilePath, "utf8");

const ejecutar = (sentencia, parametros = []) => new Promise((resolve, reject) => {
  db.run(sentencia, parametros, function resultado(error) {
    if (error) reject(error);
    else resolve(this);
  });
});

const ejecutarScript = () => new Promise((resolve, reject) => {
  db.exec(sql, (error) => (error ? reject(error) : resolve()));
});

const cerrarConexion = () => new Promise((resolve, reject) => {
  db.close((error) => (error ? reject(error) : resolve()));
});

async function inicializar() {
  try {
    if (!adminEmail || !adminPassword) {
      throw new Error("ADMIN_EMAIL y ADMIN_PASSWORD deben estar definidos en backend/.env");
    }
    await ejecutarScript();
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await ejecutar(`
      INSERT INTO administradores (email, password, role, activo)
      VALUES (?, ?, 'admin', 1)
      ON CONFLICT(email) DO UPDATE SET
        password = excluded.password,
        role = 'admin',
        activo = 1,
        updated_at = CURRENT_TIMESTAMP
    `, [adminEmail.trim().toLowerCase(), passwordHash]);
    console.log("Base de datos inicializada correctamente.");
    console.log(`Administrador configurado: ${adminEmail.trim().toLowerCase()}`);
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error.message);
    process.exitCode = 1;
  } finally {
    try {
      await cerrarConexion();
    } catch (error) {
      console.error("Error al cerrar la conexion:", error.message);
      process.exitCode = 1;
    }
  }
}

inicializar();
