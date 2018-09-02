const axiosApiDocGenerator = require('axios-api-doc-generator');

const {
  API: { withoutAuthentication: API, withoutInterceptor: APIwithoutInterceptor },
  closeWebserver,
  startWebserver,
} = require('../../../../helpers/functional-tests-helper');
const { removeAllUsersFromDatabase } = require('./helper');
const { usersService, usersValidator } = require('../../');

beforeAll(() => startWebserver());

afterAll(async () => {
  await axiosApiDocGenerator.createApiDocsForTests();
  return closeWebserver();
});

const ENDPOINT = '/api/users/sign-up';
describe(`[POST] ${ENDPOINT}`, () => {
  beforeEach(() => removeAllUsersFromDatabase());

  it('(200) when receiving a valid user', async () => {
    const user = {
      email: 'valid@email.com',
      username: 'leonardo',
      password: '1q2w#E$R',
    };

    const response = await API.post(ENDPOINT, user);
    const { data: body, headers } = response;

    // body
    expect(body).toBe('');

    // headers
    expect(typeof headers.authorization).toBe('string');
    expect(headers.authorization).not.toBeNull();
  });

  it('(500) when receiving an empty user', () => {
    const user = {};

    return API.post(ENDPOINT, user)
      .catch(err => {
        const body = err.response.data;
        expect(body).toEqual(usersValidator.ERRORS.USER_IS_EMPTY);
      });
  });

  describe('[validations] username', () => {
    it('(500) when receiving an empty "user.username"', () => {
      const user = { username: '' };

      return API.post(ENDPOINT, user)
        .catch(err => {
          const body = err.response.data;
          expect(body).toEqual(usersValidator.ERRORS.USERNAME_NOT_PROVIDED);
        });
    });

    it('(500) when receiving an "user.username" that is too long', () => {
      const user = { username: 'username that is too long' };

      return API.post(ENDPOINT, user)
        .catch(err => {
          const body = err.response.data;
          expect(body).toEqual(usersValidator.ERRORS.USERNAME_TOO_LONG);
        });
    });

    it('(500) when receiving an "user.username" that is already in use', async () => {
      const username = 'leonardo';
      const user1 = {
        username,
        email: 'valid@email.com',
        password: '1q2w#E$R',
      };
      const user2 = {
        username,
        email: 'another@email.com',
        password: '1q2w#E$R',
      };

      await APIwithoutInterceptor.post(ENDPOINT, user1);
      return API.post(ENDPOINT, user2)
        .catch(err => {
          const body = err.response.data;
          expect(body).toEqual(usersValidator.ERRORS.USERNAME_ALREADY_IN_USE);
        });
    });
  });

  describe('[validations] email', () => {
    it('(500) when receiving an empty "user.email"', () => {
      const user = { username: 'leonardo', email: '' };

      return API.post(ENDPOINT, user)
        .catch(err => {
          const body = err.response.data;
          expect(body).toEqual(usersValidator.ERRORS.EMAIL_NOT_PROVIDED);
        });
    });

    it('(500) when receiving an "user.email" that is invalid', () => {
      const user = { username: 'leonardo', email: 'invalid#1~@email#.com' };

      return API.post(ENDPOINT, user)
        .catch(err => {
          const body = err.response.data;
          expect(body).toEqual(usersValidator.ERRORS.EMAIL_NOT_VALID);
        });
    });

    it('(500) when receiving an "user.email" that is already in use', async () => {
      const email = 'email@already-in-use.com';
      const user1 = {
        email,
        username: 'user1',
        password: '1q2w#E$R',
      };
      const user2 = {
        email,
        username: 'user2',
        password: '1q2w#E$R',
      };

      await APIwithoutInterceptor.post(ENDPOINT, user1);
      return API.post(ENDPOINT, user2)
        .catch(err => {
          const body = err.response.data;
          expect(body).toEqual(usersValidator.ERRORS.EMAIL_ALREADY_IN_USE);
        });
    });
  });

  describe('[validations] password', () => {
    it('(500) when receiving an empty "user.password"', () => {
      const user = {
        email: 'valid@email.com',
        password: '',
        username: 'leonardo',
      };

      return API.post(ENDPOINT, user)
        .catch(err => {
          const body = err.response.data;
          expect(body).toEqual(usersValidator.ERRORS.PASSWORD_NOT_PROVIDED);
        });
    });

    it('(500) when receiving an "user.password" that is not strong enough', () => {
      const user = {
        email: 'valid@email.com',
        password: 'not strong enough',
        username: 'leonardo',
      };

      return API.post(ENDPOINT, user)
        .catch(err => {
          const body = err.response.data;
          expect(body).toEqual(usersValidator.ERRORS.PASSWORD_NOT_STRONG_ENOUGH);
        });
    });
  });
});