const express = require("express");
const { createTicketHandler, assignTicketHandler, listTicketsHandler, updateStatusHandler, detailTicketHandler } = require("../modules/ticket/ticketController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { sendMessageHandler, getConversationHandler } = require("../modules/message/messageController");
const router = express.Router();

router.post("/", authMiddleware, createTicketHandler);
router.get("/list", authMiddleware, listTicketsHandler)
router.get('/:ticketId', authMiddleware, detailTicketHandler);
router.post("/:ticketId/assign", authMiddleware, assignTicketHandler);
router.post("/:ticketId/update", authMiddleware, updateStatusHandler);
router.post("/:ticketId/messages", authMiddleware, sendMessageHandler);
router.get("/:ticketId/messages", authMiddleware, getConversationHandler);

module.exports = router;
