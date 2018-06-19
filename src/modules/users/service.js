const usersModel = require('./model');

const usersService = {
  // Dependency injection
  get usersModel() { return { ...usersModel }; },

  signUp() {

  },
};

module.exports = usersService;
