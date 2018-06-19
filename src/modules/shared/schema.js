const { DateTime } = require('luxon');

const SHARED_CONSTANTS = require('./constants');

const sharedSchema = {
  createdAt: {
    formattedDate: {
      type: String,
      default: DateTime.local()
        .toFormat(SHARED_CONSTANTS.DATE_FORMAT.COMPLETE),
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
      required: false,
    },
    isoDate: {
      type: String,
      required: false,
    },
  },
};

module.exports = sharedSchema;
