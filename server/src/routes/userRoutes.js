const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { getCustomersHandler, getAgentHandler, getAllUsersHandler } = require("../modules/users/usersController");

router.get("/lists", authMiddleware, getAllUsersHandler);
router.get("/customers", authMiddleware, getCustomersHandler);
router.get("/agents", authMiddleware, getAgentHandler);

module.exports = router;
