require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  dbFile: process.env.DB_FILE || "database/mibase.db",
  corsOrigin: process.env.CORS_ORIGIN || "*"
};
