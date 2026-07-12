const authRequired = (req, res, next) => {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({ message: "Debes iniciar sesión para acceder al carrito." });
  }
  return next();
};

module.exports = authRequired;
