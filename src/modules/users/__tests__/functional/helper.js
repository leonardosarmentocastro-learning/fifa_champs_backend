const { usersModel } = require('../../');

const helper = {
  removeAllUsersFromDatabase() {
    return usersModel.remove();
  },
};

module.exports = helper;