require("dotenv").config();

const express = require("express");
const cors = require("cors");
const usuarioRoutes = require("./routes/usuario.routes");
const errorHandler = require("./middleware/errorHandler");
const notFoundHandler = require("./middleware/notFoundHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*"
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "API RESTful con Express y SQLite funcionando correctamente",
    endpoints: {
      health: "/health",
      usuarios: "/api/usuarios"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: "sqlite",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/usuarios", usuarioRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});

module.exports = app;
