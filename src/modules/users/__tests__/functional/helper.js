const { usersModel } = require('../../');
const {
  API: { withoutAuthentication: API },
} = require('../../../../helpers/functional-tests-helper');

const helper = {
  async signupAnUser() {
    const user = {
      email: 'get-me@functional-test.com',
      username: '@leonardo',
      password: '1q2w#E$R',
    };

    const ENDPOINT = '/api/users/sign-up';
    const response = await API.post(ENDPOINT, user);
    const token = response.headers.authorization;

    return token;
  },
  removeAllUsersFromDatabase() {
    return usersModel.deleteMany({});
  },
};

module.exports = helper;
