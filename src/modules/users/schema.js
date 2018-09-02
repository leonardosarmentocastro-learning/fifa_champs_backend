const { Schema } = require('mongoose');

const { sharedSchema } = require('../shared');

const usersSchema = new Schema({
  // # E
  email: String,

  // # S
  ...sharedSchema,

  slack: {
    icon: String,
  },

  // # U
  username: String,

  privateFields: {
    // # P
    password: String,
  },
});

module.exports = usersSchema;
