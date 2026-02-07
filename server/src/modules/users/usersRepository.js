const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function findUsers(whereCondition, currentUserId) {
  if (!whereCondition.role) {
    whereCondition.role = undefined;
  }

  const users = await prisma.users.findMany({
    where: {
      ...whereCondition,
      NOT: {
        id: currentUserId,
        role: "admin",
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return users;
}

module.exports = { findUsers };
