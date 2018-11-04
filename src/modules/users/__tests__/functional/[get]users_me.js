const axiosApiDocGenerator = require('axios-api-doc-generator');

const {
  API: { withoutAuthentication: API },
  closeWebserver,
  startWebserver,
} = require('../../../../helpers/functional-tests-helper');
const { signupAnUser, removeAllUsersFromDatabase } = require('./helper');
const { usersModel, usersValidator } = require('../../');

beforeAll(() => startWebserver());

afterAll(async () => {
  await axiosApiDocGenerator.createApiDocsForTests();
  return closeWebserver();
});

const ENDPOINT = '/api/users/me';
describe(`[GET] ${ENDPOINT}`, () => {
  const specs = {
    token: '',
  };

  beforeAll(async () => {
    await removeAllUsersFromDatabase();

    specs.token = await signupAnUser();
    API.defaults.headers.common['Authorization'] = specs.token;
  });

  it('(200) returns the same token if user have not been updated since last token generation', async () => {
    const response = await API.get(ENDPOINT);
    const { headers } = response;

    expect(headers.authorization).toBe(specs.token);
  });

  it('(200) creates a new authorization token if user have been updated since last token generation', async () => {
    const [signedUpUser] = await usersModel.find();
    signedUpUser.username = 'new username';
    await signedUpUser.save();

    const response = await API.get(ENDPOINT)
    const { headers } = response;

    expect(headers.authorization).not.toBe(specs.token);
  });

  it('(500) if the token refers to a user that does not exists on the database anymore', async () => {
    await removeAllUsersFromDatabase();

    const response = await API.get(ENDPOINT)
      .catch((err) => {
        const body = err.response.data;
        expect(body).toEqual(usersValidator.ERRORS.USER_IS_EMPTY);
      });
  });
});