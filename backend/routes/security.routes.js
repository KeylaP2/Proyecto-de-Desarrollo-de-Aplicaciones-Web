const express = require("express");
const { crearTokenCsrf } = require("../middleware/csrf");

const router = express.Router();
router.get("/csrf", crearTokenCsrf);

module.exports = router;
