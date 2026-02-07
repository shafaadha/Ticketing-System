const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createMessage(data) {
  return prisma.messages.create({
    data,
    include: {
      sender: {
        select: { id: true, name: true, role: true },
      },
    },
  });
}

async function getMessagesByTicket(ticketId, tenantId) {
  return prisma.messages.findMany({
    where: {
      ticketId,
      tenantId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      sender: {
        select: { id: true, name: true, role: true },
      },
    },
  });
}

module.exports = {
  createMessage,
  getMessagesByTicket,
};
