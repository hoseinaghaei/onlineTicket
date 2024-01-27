const {
  createDocument,
  getDocumentById,
  countDocumentsByQuery,
  getAllPopulatedDocumentsWithFilterAndSort,
  updateDocumentById,
  getPopulatedDocumentById,
  getPopulatedDocumentsByQuery,
} = require('../dataAccess/dataAccess');

const TicketStatus = require('../models/enums/ticketStatus.enum');
const DeadlineStatus = require('../models/enums/deadlineStatus.enum');
const TimeService = require('../services/time.services');


hasUserReachedToMaximumOpenTicket = async (userId) => {
  const ticketCount = await countDocumentsByQuery('Ticket', {
    created_by: userId,
    status: {$ne: TicketStatus.CLOSED},
  });
  return ticketCount >= 30;
};

isTicketOpen = async (ticketId) => {
  const ticket = await getDocumentById('Ticket', ticketId);
  return ticket.status !== TicketStatus.CLOSED;
};

hasTicketExist = async (ticketId) => {
  const ticket = await getDocumentById('Ticket', ticketId);
  return ticket !== null;
};

getTicketReporterId = async (ticketId) => {
  const ticket = await getDocumentById('Ticket', ticketId);
  return ticket.created_by._id.toString();
};

getTicketOrganizationId = async (ticketId) => {
  const ticket = await getDocumentById('Ticket', ticketId);
  return ticket.organization._id.toString();
};

createNewTicket = async (data) => {
  return await createDocument('Ticket', data);
};

const getAllTicketsOfUserWithFilterAndSorting = async (userId, filter, sort, deadlineStatus, organizationId) => {
  const query = {};

  if (organizationId) {
    query.organization = organizationId;
  } else {
    query.created_by = userId;
  }

  if (filter.type) {
    query.type = filter.type;
  }

  if (filter.status) {
    query.status = filter.status;
  }

  if (filter.intervalStart) {
    query.created_at = {$gte: new Date(filter.intervalStart)};
  }

  if (filter.intervalEnd) {
    query.created_at = {$lte: new Date(filter.intervalEnd)};
  }

  if (deadlineStatus === DeadlineStatus.PASSED) {
    query.deadline = {
      $lte: TimeService.now(),
    };
  }
  if (deadlineStatus === DeadlineStatus.NEAR) {
    query.deadline = {
      $gte: TimeService.now(),
      $lte: TimeService.oneDayBeforeAfter(),
    };
  }

  const options = await sortTickets(sort);

  const result = await getAllPopulatedDocumentsWithFilterAndSort('Ticket', query, options);

  return result;
};

const sortTickets = async (sort) => {
  const options = {};

  if (sort.type) {
    options[sort.type] = sort.order === 'ASC' ? 1 : -1;
  }
  return options;
};

const getTicketById = async (ticketId) => {
  const ticket = await getPopulatedDocumentById('Ticket', ticketId);
  return ticket;
};

const getTicketsByTitle = async (ticketTilte) => {
  const regex = new RegExp(ticketTilte, 'i');
  const tickets = await getPopulatedDocumentsByQuery('Ticket', { title: { $regex: regex } });
  return tickets;
};


editTicket = async (id, data) => {
  return await updateDocumentById('Ticket', id, data);
};

const TicketRepository = {
  hasUserReachedToMaximumOpenTicket,
  createNewTicket,
  getAllTicketsOfUserWithFilterAndSorting,
  getTicketById,
  editTicket,
  isTicketOpen,
  getTicketReporterId,
  hasTicketExist,
  getTicketOrganizationId,
  getTicketsByTitle,
};

module.exports = TicketRepository;
