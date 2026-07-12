const express = require("express");
const adminController = require("../controllers/admin.controller");
const usuarioController = require("../controllers/usuario.controller");
const adminRequired = require("../middleware/adminRequired");

const router = express.Router();

router.post("/login", adminController.login);
router.post("/logout", adminController.logout);
router.get("/me", adminController.me);

router.use(adminRequired);
router.get("/usuarios", usuarioController.getUsuarios);
router.get("/usuarios/:id", usuarioController.getUsuarioById);
router.post("/usuarios", usuarioController.createUsuario);
router.put("/usuarios/:id", usuarioController.updateUsuario);
router.delete("/usuarios/:id", usuarioController.deleteUsuario);

module.exports = router;
