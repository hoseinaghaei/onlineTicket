const mongoose = require('mongoose');
const TimeServices = require('../services/time.services');

const SuspendedUSerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  suspended_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created_at: {
    type: Date,
    default: TimeServices.now,
    required: true,
  },
});

const SuspendedUSer = mongoose.model('SuspendedUser', SuspendedUSerSchema);
module.exports = SuspendedUSer;

