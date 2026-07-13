const express = require("express");
const authRequired = require("../middleware/authRequired");
const carritoController = require("../controllers/carrito.controller");
const { requireCsrf } = require("../middleware/csrf");

const router = express.Router();

router.use(authRequired);
router.get("/", carritoController.getCarrito);
router.put("/", requireCsrf, carritoController.guardarCarrito);

module.exports = router;
