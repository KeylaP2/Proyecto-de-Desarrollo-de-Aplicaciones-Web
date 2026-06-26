const fs = require("fs");
const path = require("path");
const db = require("./connection");

const sqlFilePath = path.resolve(__dirname, "database.sql");
const sql = fs.readFileSync(sqlFilePath, "utf8");

db.exec(sql, (error) => {
  if (error) {
    console.error("Error al inicializar la base de datos:", error.message);
    process.exitCode = 1;
  } else {
    console.log("Base de datos inicializada correctamente.");
  }

  db.close((closeError) => {
    if (closeError) {
      console.error("Error al cerrar la conexion:", closeError.message);
      process.exitCode = 1;
    }
  });
});
