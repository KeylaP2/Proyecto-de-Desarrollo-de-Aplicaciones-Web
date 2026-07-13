const express = require("express");
const adminController = require("../controllers/admin.controller");
const usuarioController = require("../controllers/usuario.controller");
const adminRequired = require("../middleware/adminRequired");
const { requireCsrf } = require("../middleware/csrf");

const router = express.Router();

router.post("/login", requireCsrf, adminController.login);
router.post("/logout", requireCsrf, adminController.logout);
router.get("/me", adminController.me);

router.use(adminRequired);
router.get("/usuarios", usuarioController.getUsuarios);
router.get("/usuarios/:id", usuarioController.getUsuarioById);
router.post("/usuarios", requireCsrf, usuarioController.createUsuario);
router.put("/usuarios/:id", requireCsrf, usuarioController.updateUsuario);
router.delete("/usuarios/:id", requireCsrf, usuarioController.deleteUsuario);

module.exports = router;
