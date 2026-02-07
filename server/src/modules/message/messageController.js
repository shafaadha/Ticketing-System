const messageService = require("./messageService");

async function sendMessageHandler(req, res) {
  try {
    const user = req.user;
    const ticketId = parseInt(req.params.ticketId);
    const { content } = req.body;

    const message = await messageService.sendMessage(user, ticketId, content);

    const io = req.app.get("io");

    io.to(`ticket_${ticketId}`).emit("newMessage", message);

    return res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      error: err.message || "Internal server error",
    });
  }
}

async function getConversationHandler(req, res) {
  try {
    const user = req.user;
    const ticketId = parseInt(req.params.ticketId);

    const messages = await messageService.getConversation(user, ticketId);

    return res.status(200).json({
      message: "Conversation loaded",
      data: messages,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      error: err.message || "Internal server error",
    });
  }
}

module.exports = {
  sendMessageHandler,
  getConversationHandler,
};
