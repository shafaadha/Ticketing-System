const ticketService = require("./ticketService");

async function createTicketHandler(req, res) {
  try {
    const user = req.user;
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const ticket = await ticketService.createTicket(user, {
      title,
      description,
      priority,
    });

    res.status(201).json({ticket});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function detailTicketHandler(req, res) {
  try {
    const user = req.user;
    const ticketId = req.params.ticketId;

    const detailTicket = await ticketService.detailTicket(user, ticketId);

    res.json({
      success: true,
      data: detailTicket,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
}

async function assignTicketHandler(req, res) {
  try {
    const { ticketId } = req.params;
    const { agentId } = req.body;
    const updatedTicket = await ticketService.assignTicket(
      req.user,
      ticketId,
      agentId,
    );
    res.json(updatedTicket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateStatusHandler(req, res) {
  try {
    const { status } = req.body;
    const ticketId = parseInt(req.params.ticketId);
    const ticket = await ticketService.updateTicketStatus(ticketId, status);
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function listTicketsHandler(req, res) {
  try {
    const filters = {
      status: req.query.status,
      agentId: req.query.agentId ? parseInt(req.query.agentId) : undefined,
    };
    const tickets = await ticketService.listTickets(req.user, filters);
    res.json(tickets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function messageHandler(req, res) {}

module.exports = {
  createTicketHandler,
  detailTicketHandler,
  assignTicketHandler,
  updateStatusHandler,
  listTicketsHandler,
  messageHandler,
};
