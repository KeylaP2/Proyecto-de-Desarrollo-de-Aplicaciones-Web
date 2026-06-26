const Usuario = require("../models/usuario.model");

const camposObligatorios = [
  "nombre",
  "apellido",
  "telefono",
  "fechaNacimiento",
  "genero",
  "password"
];

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

    if (faltanCamposObligatorios(req.body)) {
      return res.status(400).json({
        message: "Los campos nombre, apellido, email/correo, telefono, fechaNacimiento, genero y password son obligatorios"
      });
    }

    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      telefono,
      fechaNacimiento,
      genero,
      password
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
        message: "Los campos nombre, apellido, email/correo, telefono, fechaNacimiento, genero y password son obligatorios"
      });
    }

    const result = await Usuario.update(req.params.id, {
      nombre,
      apellido,
      email,
      telefono,
      fechaNacimiento,
      genero,
      password
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
