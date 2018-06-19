const { Schema } = require('mongoose');

const sharedSchema = require('../shared/schema');

const usersSchema = new Schema({
  // # S
  ...sharedSchema,

  slack: {
    displayName: String,
    icon: String,
  },

  privateFields: {
    // # P
    password: String,
  },
});

module.exports = usersSchema;