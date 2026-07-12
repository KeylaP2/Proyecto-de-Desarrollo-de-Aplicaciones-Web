require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const helmet = require("helmet");
const path = require("path");
const usuarioRoutes = require("./routes/usuario.routes");
const authRoutes = require("./routes/auth.routes");
const carritoRoutes = require("./routes/carrito.routes");
const adminRoutes = require("./routes/admin.routes");
const securityRoutes = require("./routes/security.routes");
const SQLiteSessionStore = require("./models/sessionStore");
const errorHandler = require("./middleware/errorHandler");
const notFoundHandler = require("./middleware/notFoundHandler");
const { corsOrigin, sessionSecret, sessionDbFile, isProduction } = require("./config/env");

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = corsOrigin.split(",").map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    const esOrigenLocalDeDesarrollo = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || "");
    if (!origin || allowedOrigins.includes(origin) || (!isProduction && esOrigenLocalDeDesarrollo)) {
      return callback(null, true);
    }
    return callback(new Error("Origen no permitido por CORS"));
  },
  credentials: true
}));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:3000", "http://127.0.0.1:3000"]
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  name: "solotenis.sid",
  secret: sessionSecret,
  store: new SQLiteSessionStore({
    filename: path.resolve(__dirname, sessionDbFile),
    ttlMs: 1000 * 60 * 60 * 2
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 2
  }
}));

app.get("/", (req, res) => {
  res.json({
    message: "API RESTful con Express y SQLite funcionando correctamente",
    endpoints: {
      health: "/health",
      usuarios: "/api/usuarios",
      autenticacion: "/api/auth",
      carrito: "/api/carrito",
      administracion: "/api/admin"
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
app.use("/api/security", securityRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
  });
}

module.exports = app;
