const usersService = require("./usersService");

async function getCustomersHandler(req, res) {
  try {
    const customers = await usersService.getCustomers(req.user);
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAgentHandler(req, res) {
  try {
    const agent = await usersService.getAgent(req.user);
    res.json(agent);
  } catch {
    res.status(500).json({ error: err.message });
  }
}

async function getAllUsersHandler(req, res) {
  try {
    const user = req.user;
    const users = await usersService.getAllUsers(user);
    return res.json({ data: users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


module.exports = {
  getCustomersHandler,
  getAgentHandler,
  getAllUsersHandler
};
