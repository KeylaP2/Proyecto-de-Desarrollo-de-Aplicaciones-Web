const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
    path: req.originalUrl
  });
};

module.exports = notFoundHandler;
