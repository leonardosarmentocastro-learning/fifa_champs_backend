const axiosApiDocGenerator = require('axios-api-doc-generator');

const {
  API,
  closeWebserver,
  startWebserver,
} = require('../../../../helpers/functional-tests-helper');
const { removeAllUsersFromDatabase } = require('./helper');
const usersValidator = require('../../validator');

beforeAll(async () => {
  await startWebserver();
  return await removeAllUsersFromDatabase();
});

afterAll(async () => {
  await axiosApiDocGenerator.createApiDocsForTests();
  return closeWebserver();
});

const ENDPOINT = '/api/users/sign-up';
describe(`[POST] ${ENDPOINT}`, () => {
  it('(200) when receiving a valid user', () => {
    const user = {
      slack: {
        displayName: '@leonardo.caxumba',
      },
      password: '1q2w#E$R',
    };

    return API.post(ENDPOINT, user)
      .catch(err => {
        const body = err.response.data;
        // TODO
        // 1. write expectations
        // Fix "usersService.signUp"

        // expect(body).toMatchObject(user);
      });
  });

  it('(500) when receiving an empty user', () => {
    const user = {};

    return API.post(ENDPOINT, user)
      .catch(err => {
        const body = err.response.data;
        expect(body).toEqual(usersValidator.ERRORS.USER_IS_EMPTY);
      });
  });

  it('(500) when receiving an empty "user.slack.displayName"', () => {
    const user = {
      slack: {
        displayName: '',
      },
    };

    return API.post(ENDPOINT, user)
      .catch(err => {
        const body = err.response.data;
        expect(body).toEqual(usersValidator.ERRORS.NO_SLACK_DISPLAY_NAME_PROVIDED);
      });
  });

  it('(500) when receiving an empty "user.password"', () => {
    const user = {
      slack: {
        displayName: '@leonardo.caxumba',
      },
      password: '',
    };

    return API.post(ENDPOINT, user)
      .catch(err => {
        const body = err.response.data;
        expect(body).toEqual(usersValidator.ERRORS.NO_PASSWORD_PROVIDED);
      });
  });

  it('(500) when receiving an "user.password" that is not strong enough', () => {
    const user = {
      slack: {
        displayName: '@leonardo.caxumba',
      },
      password: 'not strong enough',
    };

    return API.post(ENDPOINT, user)
      .catch(err => {
        const body = err.response.data;
        expect(body).toEqual(usersValidator.ERRORS.PASSWORD_IS_NOT_STRONG_ENOUGH);
      });
  });

  it('(500) when receiving an user which the given "slack.displayName" already exists', () => {
    // TODO
  });
});