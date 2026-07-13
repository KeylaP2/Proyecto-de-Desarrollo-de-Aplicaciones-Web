const Usuario = require("../models/usuario.model");
const bcrypt = require("bcryptjs");

const camposObligatorios = [
  "nombre",
  "apellido",
  "telefono",
  "fechaNacimiento",
  "genero"
];
const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordValida = (password) => typeof password === "string" && password.length >= 8;

const faltanCamposObligatorios = (body) => {
  return camposObligatorios.some((campo) => !body[campo]) || !(body.email || body.correo);
};

const getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json({ data: usuarios });
  } catch (error) {
    next(error);
  }
};

const getUsuarioById = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({ data: usuario });
  } catch (error) {
    return next(error);
  }
};

const createUsuario = async (req, res, next) => {
  try {
    const { nombre, apellido, correo, telefono, fechaNacimiento, genero, password } = req.body;
    const email = req.body.email || correo;

    if (faltanCamposObligatorios(req.body) || !password) {
      return res.status(400).json({
        message: "Los campos nombre, apellido, email/correo, telefono, fechaNacimiento, genero y password son obligatorios"
      });
    }

    if (!emailValido.test(email) || !passwordValida(password)) {
      return res.status(400).json({
        message: "El correo debe ser válido y la contraseña debe tener al menos 8 caracteres."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      telefono,
      fechaNacimiento,
      genero,
      password: passwordHash
    });
    return res.status(201).json({ data: usuario });
  } catch (error) {
    return next(error);
  }
};

const updateUsuario = async (req, res, next) => {
  try {
    const { nombre, apellido, correo, telefono, fechaNacimiento, genero, password } = req.body;
    const email = req.body.email || correo;

    if (faltanCamposObligatorios(req.body)) {
      return res.status(400).json({
        message: "Los campos nombre, apellido, email/correo, telefono, fechaNacimiento y genero son obligatorios"
      });
    }

    if (!emailValido.test(email) || (password && !passwordValida(password))) {
      return res.status(400).json({
        message: "El correo debe ser válido y la nueva contraseña debe tener al menos 8 caracteres."
      });
    }

    const passwordHash = password ? await bcrypt.hash(password, 12) : undefined;
    const result = await Usuario.update(req.params.id, {
      nombre,
      apellido,
      email,
      telefono,
      fechaNacimiento,
      genero,
      password: passwordHash
    });

    if (result.changes === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const usuario = await Usuario.findById(req.params.id);
    return res.json({ data: usuario });
  } catch (error) {
    return next(error);
  }
};

const deleteUsuario = async (req, res, next) => {
  try {
    const result = await Usuario.remove(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
};
