const { DateTime } = require('luxon');

const SHARED_CONSTANTS = require('./constants');

const sharedSchema = {
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
};

module.exports = sharedSchema;
