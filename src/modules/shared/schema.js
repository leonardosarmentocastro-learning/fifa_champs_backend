const { DateTime } = require('luxon');
const { Schema } = require('mongoose');

const SHARED_CONSTANTS = require('./constants');

const sharedSchema = new Schema({
  // # C
  createdAt: {
    formattedDate: {
      type: String,
      default: DateTime.local()
        .toFormat(SHARED_CONSTANTS.DATE_FORMAT.COMPLETE),
      required: true,
    },
    isoDate: {
      type: String,
      default: DateTime.local().toISO(),
      required: true,
    },
  },

  // # U
  updatedAt: {
    formattedDate: {
      type: String,
      default: '',
    },
    isoDate: {
      type: String,
      default: '',
    },
  },
});

// Middlewares
sharedSchema.pre('save', function(next) {
  this.updatedAt.formattedDate = DateTime.local().toFormat(SHARED_CONSTANTS.DATE_FORMAT.COMPLETE);
  this.updatedAt.isoDate = DateTime.local().toISO();

  return next();
});

module.exports = sharedSchema;
