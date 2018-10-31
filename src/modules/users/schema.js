const { Schema } = require('mongoose');

const { sharedSchema } = require('../shared');

const usersSchema = new Schema({
  // # E
  email: String,

  // # S
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

// Inherit schemas
usersSchema.add(sharedSchema);

module.exports = usersSchema;
