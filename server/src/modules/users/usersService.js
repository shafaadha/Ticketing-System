const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const userRepository = require("./usersRepository");

async function getAllUsers(user) {
  let whereCondition = { tenantId: user.tenantId };

  if (user.role !== "admin") {
    whereCondition.role = "customer";
  }

  const users = await userRepository.findUsers(whereCondition, user.id);
  return users;
}

async function getCustomer(user) {
  return prisma.users.findMany({
    where: {
      tenantId: user.tenantId,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

async function getAgent(user) {
  return prisma.users.findMany({
    where: {
      tenantId: user.tenantId,
      role: "agent",
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

module.exports = {
  getCustomer,
  getAgent,
  getAllUsers,
};
