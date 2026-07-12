const express = require("express");
const usuarioController = require("../controllers/usuario.controller");
const { requireCsrf } = require("../middleware/csrf");

const router = express.Router();

router.post("/", requireCsrf, usuarioController.createUsuario);

module.exports = router;
