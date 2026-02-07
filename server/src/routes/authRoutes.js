const express = require("express");
const { login } = require("../modules/auth/authController");

const router = express.Router();

router.post("/login", login);

module.exports = router;
