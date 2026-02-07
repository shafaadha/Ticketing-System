const ticketRepository = require("../ticket/ticketRepository");
const messageRepository = require("./messageRepository");

function canAccessTicket(user, ticket) {
  if (user.role === "admin") return true;

  if (user.role === "agent") {
    return ticket.assignedAgentId === user.id;
  }

  if (user.role === "customer") {
    return ticket.customerId === user.id;
  }

  return false;
}

async function sendMessage(user, ticketId, content) {
  if (!content || content.trim() === "") {
    throw { status: 400, message: "Message content is required" };
  }

  const ticket = await ticketRepository.findTicketById(ticketId);

  if (!ticket) {
    throw { status: 404, message: "Ticket not found" };
  }

  if (ticket.tenantId !== user.tenantId) {
    throw { status: 403, message: "Forbidden: different tenant" };
  }

  if (!canAccessTicket(user, ticket)) {
    throw { status: 403, message: "Forbidden: no access to this ticket" };
  }

  if (ticket.status === "closed") {
    throw { status: 400, message: "Ticket is closed, cannot send message" };
  }

  const message = await messageRepository.createMessage({
    ticketId: ticket.id,
    senderId: user.id,
    tenantId: user.tenantId,
    content: content.trim(),
  });

  return message;
}

async function getConversation(user, ticketId) {
  const ticket = await ticketRepository.findTicketById(ticketId);

  if (!ticket) {
    throw { status: 404, message: "Ticket not found" };
  }

  if (ticket.tenantId !== user.tenantId) {
    throw { status: 403, message: "Forbidden: different tenant" };
  }

  if (!canAccessTicket(user, ticket)) {
    throw { status: 403, message: "Forbidden: no access to this ticket" };
  }

  return messageRepository.getMessagesByTicket(ticket.id, user.tenantId);
}

module.exports = {
  sendMessage,
  getConversation,
};
