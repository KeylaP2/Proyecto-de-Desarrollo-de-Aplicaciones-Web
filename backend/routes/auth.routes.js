const express = require("express");
const authController = require("../controllers/auth.controller");
const { requireCsrf } = require("../middleware/csrf");

const router = express.Router();

router.post("/login", requireCsrf, authController.login);
router.post("/logout", requireCsrf, authController.logout);
router.get("/me", authController.me);

module.exports = router;
