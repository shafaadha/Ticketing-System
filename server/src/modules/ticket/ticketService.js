const ticketRepo = require("./ticketRepository");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTicket(user, ticketData) {
  return ticketRepo.createTicket({
    title: ticketData.title,
    description: ticketData.description,
    priority: ticketData.priority,
    tenantId: user.tenantId,
    customerId: user.id,
  });
}

async function detailTicket(user, ticketId) {
  const ticket = await ticketRepo.findTicketById(ticketId);

  if (!ticket) throw new Error("Ticket tidak ditemukan");

  if (ticket.tenantId !== user.tenantId) {
    throw new Error("Tidak punya akses ticket ini");
  }

  if (user.role === "customer" && ticket.customerId !== user.id) {
    throw new Error("Ticket ini bukan milik Anda");
  }

  if (user.role === "agent" && ticket.assignedAgentId !== user.id) {
    throw new Error("Ticket ini bukan assignment Anda");
  }

  return ticket;
}

async function assignTicket(user, ticketId, agentId) {
  const ticket = await ticketRepo.findTicketById(ticketId);
  if (!ticket) throw new Error("Ticket tidak ditemukan");

  if (user.role !== "admin")
    throw new Error("Tidak memiliki akses assign ticket");

  const ticketIdInt = parseInt(ticketId);
  const agentIdInt = parseInt(agentId);
  return prisma.tickets.update({
    where: { id: ticketIdInt },
    data: { assignedAgentId: agentIdInt },
  });
}

async function updateTicketStatus(ticketId, status) {
  return prisma.tickets.update({
    where: { id: ticketId },
    data: { status },
  });
}

async function listTickets(user, filters = {}) {
  const where = { tenantId: user.tenantId };

  if (filters.status) {
    where.status = filters.status;
  }

  if (user.role === "customer") {
    where.customerId = user.id;
  }

  if (user.role === "agent") {
    where.assignedAgentId = user.id;
  }

  if (user.role === "admin" && filters.agentId) {
    where.assignedAgentId = filters.agentId;
  }

  return ticketRepo.listTickets(where);
}

module.exports = {
  createTicket,
  detailTicket,
  assignTicket,
  updateTicketStatus,
  listTickets,
};
