const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Usuario = require("../models/usuario.model");
const Admin = require("../models/admin.model");
const LoginAttempt = require("../models/loginAttempt.model");

const MAX_INTENTOS = 5;
const VENTANA_MS = 15 * 60 * 1000;

const claveIntentos = (req, email) => `${req.ip}:${email}`;

const datosPublicos = (usuario) => ({
  id: usuario.id,
  nombre: usuario.nombre,
  apellido: usuario.apellido,
  email: usuario.email
});

const login = async (req, res, next) => {
  try {
    const email = String(req.body.email || req.body.correo || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) return res.status(400).json({ message: "El correo y la contraseña son obligatorios." });
    const clave = claveIntentos(req, email);
    const intento = await LoginAttempt.find(clave);
    if (intento && intento.attempts >= MAX_INTENTOS && Date.now() - intento.first_attempt < VENTANA_MS) {
      return res.status(429).json({ message: "Demasiados intentos. Espera 15 minutos e inténtalo de nuevo." });
    }

    const usuario = await Usuario.findByEmailWithPassword(email);
    const administrador = usuario ? null : await Admin.findByEmailWithPassword(email);
    let esValida = false;

    if (usuario) {
      if (usuario.password.startsWith("$2")) {
        esValida = await bcrypt.compare(password, usuario.password);
      } else {
        // Compatibilidad con registros anteriores: se migra el hash al iniciar sesión correctamente.
        const passwordBuffer = Buffer.from(password);
        const storedPasswordBuffer = Buffer.from(usuario.password);
        esValida = passwordBuffer.length === storedPasswordBuffer.length
          && crypto.timingSafeEqual(passwordBuffer, storedPasswordBuffer);
        if (esValida) await Usuario.updatePassword(usuario.id, await bcrypt.hash(password, 12));
      }
    }

    if (!usuario && administrador?.activo) {
      esValida = await bcrypt.compare(password, administrador.password);
      if (esValida) {
        await LoginAttempt.clear(clave);
        return req.session.regenerate((error) => {
          if (error) return next(error);
          req.session.admin = {
            id: administrador.id,
            email: administrador.email,
            role: administrador.role
          };
          return res.json({ data: req.session.admin });
        });
      }
    }

    if (!esValida) {
      await LoginAttempt.recordFailure(clave, VENTANA_MS);
      return res.status(401).json({ message: "Correo o contraseña incorrectos." });
    }

    await LoginAttempt.clear(clave);
    return req.session.regenerate((error) => {
      if (error) return next(error);
      req.session.usuario = datosPublicos(usuario);
      return res.json({ data: req.session.usuario });
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
  return res.json({ data: req.session.usuario || null });
};

module.exports = { login, logout, me };
