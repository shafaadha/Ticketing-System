const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTicket(data) {
  return prisma.tickets.create({ data });
}

async function listTickets(where) {
  return prisma.tickets.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

async function findTicketById(ticketId) {
  const id = parseInt(ticketId);

  if (isNaN(id)) throw new Error("Ticket ID tidak valid");

  return prisma.tickets.findUnique({
    where: { id },
    include: {
      users_tickets_customerIdTousers: {
        select: { id: true, name: true, email: true, role: true },
      },
      users_tickets_assignedAgentIdTousers: {
        select: { id: true, name: true, email: true, role: true },
      },
      messages: {
        include: {
          sender: {
            select: { id: true, name: true, role: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

module.exports = {
  findTicketById,
};

async function assignTicket(ticketId, agentId) {
  return prisma.tickets.update({
    where: { id: ticketId },
    data: { assignedAgentId: agentId },
  });
}

async function updateTicketStatus(ticketId, status) {
  return prisma.tickets.update({
    where: { id: ticketId },
    data: { status },
  });
}

module.exports = {
  createTicket,
  listTickets,
  assignTicket,
  updateTicketStatus,
  findTicketById,
};
