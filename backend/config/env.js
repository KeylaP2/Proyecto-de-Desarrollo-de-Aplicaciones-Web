require("dotenv").config();
const crypto = require("crypto");

const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET es obligatoria cuando NODE_ENV=production");
}

if (isProduction && (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)) {
  throw new Error("ADMIN_EMAIL y ADMIN_PASSWORD son obligatorias cuando NODE_ENV=production");
}

module.exports = {
  port: process.env.PORT || 3000,
  dbFile: process.env.DB_FILE || "database/mibase.db",
  corsOrigin: process.env.CORS_ORIGIN || "http://127.0.0.1:5500,http://localhost:5500",
  sessionSecret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
  adminEmail: process.env.ADMIN_EMAIL || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  isProduction
};
