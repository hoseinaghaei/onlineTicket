const TicketServices = require('../services/ticket.services');

addTicket = async (req, res) => {
  await TicketServices.createTicket(req, res);
};

editTicket = async (req, res) => {
  await TicketServices.editTicket(req, res);
};

changeStatus = async (req, res) => {
  await TicketServices.changeTicketStatus(req, res);
};

const getUserTickets = async (req, res) => {
  await TicketServices.getTicketsByUser(req, res);
};

const getOrganiztionTickets = async (req, res) => {
  await TicketServices.getTicketsByOrganization(req, res);
};

const getTicket = async (req, res) => {
  await TicketServices.getTicket(req, res);
};

const getTicketsByTitle = async (req, res) => {
  await TicketServices.getTicketsByTitle(req, res);
};

const TicketControllers = {
  addTicket,
  editTicket,
  changeStatus,
  getOrganiztionTickets,
  getUserTickets,
  getTicket,
  getTicketsByTitle,
};

module.exports = TicketControllers;
