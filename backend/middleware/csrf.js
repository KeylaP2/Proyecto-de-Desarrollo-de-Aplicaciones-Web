const crypto = require("crypto");

const crearTokenCsrf = (req, res) => {
  if (!req.session.csrfToken) req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  return res.json({ data: { csrfToken: req.session.csrfToken } });
};

const requireCsrf = (req, res, next) => {
  const recibido = String(req.get("X-CSRF-Token") || "");
  const esperado = String(req.session?.csrfToken || "");
  const valido = recibido.length === esperado.length && recibido.length > 0
    && crypto.timingSafeEqual(Buffer.from(recibido), Buffer.from(esperado));
  if (!valido) return res.status(403).json({ code: "CSRF_INVALID", message: "Token de seguridad inválido o vencido." });
  return next();
};

module.exports = { crearTokenCsrf, requireCsrf };
