const Carrito = require("../models/carrito.model");

const esItemValido = (item) => item
  && typeof item.id === "string"
  && typeof item.productoBaseId === "string"
  && typeof item.nombre === "string"
  && typeof item.precio === "number"
  && Number.isFinite(item.precio)
  && Number.isInteger(item.cantidad)
  && item.cantidad >= 1
  && item.cantidad <= 12;

const getCarrito = async (req, res, next) => {
  try {
    const items = await Carrito.findByUsuarioId(req.session.usuario.id);
    return res.json({ data: items });
  } catch (error) {
    return next(error);
  }
};

const guardarCarrito = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length > 50 || !items.every(esItemValido)) {
      return res.status(400).json({ message: "El carrito contiene datos no válidos." });
    }
    await Carrito.saveByUsuarioId(req.session.usuario.id, items);
    return res.json({ data: items });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getCarrito, guardarCarrito };
