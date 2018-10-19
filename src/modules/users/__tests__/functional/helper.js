const { usersModel } = require('../../');

const helper = {
  signupAnUser() {
    const user = {
      email: 'get-me@functional-test.com',
      username: '@leonardo',
      password: '1q2w#E$R',
    };

    const response = await API.post(ENDPOINT, user);
    const token = response.headers.authorization;

    return token;
  },
  removeAllUsersFromDatabase() {
    return usersModel.remove();
  },
};

module.exports = helper;
