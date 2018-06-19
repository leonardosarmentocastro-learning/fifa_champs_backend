const mongoose = require('mongoose');

const usersSchema = require('./schema');

const name = 'User';
const usersModel = mongoose.model(name, usersSchema);
module.exports = usersModel;
