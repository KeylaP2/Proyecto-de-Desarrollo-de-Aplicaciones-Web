const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.code === "SQLITE_CONSTRAINT") {
    return res.status(409).json({
      message: "Conflicto con los datos enviados",
      detail: error.message
    });
  }

  return res.status(500).json({
    message: "Error interno del servidor"
  });
};

module.exports = errorHandler;
