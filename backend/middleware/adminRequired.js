const adminRequired = (req, res, next) => {
  if (!req.session?.admin) {
    return res.status(401).json({ message: "Se requiere una sesión de administrador." });
  }
  return next();
};

module.exports = adminRequired;
