const bcrypt = require("bcryptjs");
const Admin = require("../models/admin.model");
const LoginAttempt = require("../models/loginAttempt.model");

const MAX_INTENTOS = 5;
const VENTANA_MS = 15 * 60 * 1000;

const login = async (req, res, next) => {
  const claveIntentos = req.ip;
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  try {
    const clave = `admin:${claveIntentos}:${email}`;
    const intento = await LoginAttempt.find(clave);
    if (intento && intento.attempts >= MAX_INTENTOS && Date.now() - intento.first_attempt < VENTANA_MS) {
      return res.status(429).json({ message: "Demasiados intentos. Espera 15 minutos." });
    }
    const admin = await Admin.findByEmailWithPassword(email);
    const credencialesValidas = Boolean(admin?.activo) && await bcrypt.compare(password, admin.password);

    if (!credencialesValidas) {
      await LoginAttempt.recordFailure(clave, VENTANA_MS);
      return res.status(401).json({ message: "Credenciales administrativas incorrectas." });
    }

    await LoginAttempt.clear(clave);
    return req.session.regenerate((error) => {
      if (error) return next(error);
      req.session.admin = { id: admin.id, email: admin.email, role: admin.role };
      return res.json({ data: req.session.admin });
    });
  } catch (error) {
    return next(error);
  }
};

const logout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie("solotenis.sid");
    return res.status(204).send();
  });
};

const me = (req, res) => {
  if (!req.session?.admin) return res.status(401).json({ message: "No hay una sesión administrativa activa." });
  return res.json({ data: req.session.admin });
};

module.exports = { login, logout, me };
