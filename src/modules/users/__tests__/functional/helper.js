const usersModel = require('../../model');

const helper = {
  removeAllUsersFromDatabase() {
    return usersModel.remove();
  },
};

module.exports = helper;