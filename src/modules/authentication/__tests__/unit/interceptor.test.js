const authenticationInterceptor = require('../../interceptor');

describe('[unit-test] authenticationInterceptor', () => {
  let stubbedInterceptor = null;

  beforeEach(() => {
    stubbedInterceptor = { ...authenticationInterceptor };
  });

  describe('[method] isAccessingUsingAnValidEnvironmentToken', () => {
    describe('if the current application environment is "production"', () => {
      const specs = {
        token: 'environment-tokens-are-not-allowed-in-production-mode',
      };

      beforeEach(() => {
        stubbedInterceptor.ENVIRONMENT_VARIABLES.IS_PRODUCTION_ENVIRONMENT = true;
      });

      it('it must return a "false" boolean', () => {
        expect(stubbedInterceptor.isAccessingUsingAnValidEnvironmentToken(specs.token))
          .toBeFalsy();
      });
    });

    describe('if the current application environment is "development" or "test"', () => {
      const specs = {
        token: 'environment-token',
        notEnvironmentToken: 'not-environment-token',
      };

      beforeEach(() => {
        stubbedInterceptor.ENVIRONMENT_VARIABLES.IS_DEVELOPMENT_ENVIRONMENT = true;
        stubbedInterceptor.ENVIRONMENT_VARIABLES.IS_TEST_ENVIRONMENT = true;
        stubbedInterceptor.ENVIRONMENT_VARIABLES.IS_PRODUCTION_ENVIRONMENT = false;
      });

      describe('and the provided "token" matches the "environment token"', () => {
        beforeEach(() => {
          stubbedInterceptor.ENVIRONMENT_VARIABLES.authentication.token = specs.token;
        });

        it('it must return a "true" boolean', () => {
          expect(stubbedInterceptor.isAccessingUsingAnValidEnvironmentToken(specs.token))
            .toBeTruthy();
        });
      });

      describe('and the provided "token" does not match the "environment token"', () => {
        beforeEach(() => {
          stubbedInterceptor.ENVIRONMENT_VARIABLES.authentication.token = specs.notEnvironmentToken;
        });

        it('it must return a "false" boolean', () => {
          expect(stubbedInterceptor.isAccessingUsingAnValidEnvironmentToken(specs.token))
            .toBeFalsy();
        });
      });
    });
  });

  describe('[method] isAccessingWhitelistedRoute', () => {
    describe('the following routes must be bypassed:', () => {
      it('(CORS verification) [OPTIONS] *', () => {
        expect(stubbedInterceptor.isAccessingWhitelistedRoute('OPTIONS', ''))
          .toBeTruthy();
      });

      it('[GET] /api/health', () => {
        expect(stubbedInterceptor.isAccessingWhitelistedRoute('GET', '/api/health'))
          .toBeTruthy();
      });

      it('[POST] /users/sign-in', () => {
        expect(stubbedInterceptor.isAccessingWhitelistedRoute('POST', '/api/users/sign-in'))
          .toBeTruthy();
      });

      it('[POST] /users/sign-up', () => {
        expect(stubbedInterceptor.isAccessingWhitelistedRoute('POST', '/api/users/sign-up'))
          .toBeTruthy();
      });
    });
  });

  describe('[method] middleware', () => {
    const specs = {
      req: {
        header: () => null,
        method: '',
        url: '',
      },
      res: {},
      next: jest.fn(),
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe('the request must be authorized when', () => {
      describe('a whitelisted route is being accessed', () => {
        beforeEach(() => {
          stubbedInterceptor.isAccessingWhitelistedRoute = () => true;
        });

        it('', () => {
          stubbedInterceptor.middleware(specs.req, specs.res, specs.next);
          expect(specs.next).toHaveBeenCalledTimes(1);
        });
      });

      describe('and a valid environment token is being used', () => {
        beforeEach(() => {
          specs.req.header = () => 'has-provided-an-authorization-header';

          stubbedInterceptor.isAccessingWhitelistedRoute = () => false;
          stubbedInterceptor.isAccessingUsingAnValidEnvironmentToken = () => true;
        });

        it('', () => {
          stubbedInterceptor.middleware(specs.req, specs.res, specs.next);
          expect(specs.next).toHaveBeenCalledTimes(1);
        });
      });

      describe('or a valid JWT token is being used', () => {
        beforeEach(() => {
          specs.req.header = () => 'has-provided-an-authorization-header';

          stubbedInterceptor.isAccessingWhitelistedRoute = () => false;
          stubbedInterceptor.isAccessingUsingAnValidEnvironmentToken = () => false;
          stubbedInterceptor.authenticationService.isAnValidJwtToken = () => true;
        });

        it('', () => {
          stubbedInterceptor.middleware(specs.req, specs.res, specs.next);
          expect(specs.next).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('the request must be unauthorized when', () => {
      describe('no authorization token was provided', () => {
        beforeEach(() => {
          stubbedInterceptor.unauthorize = jest.fn();

          specs.req.header = () => '';
          stubbedInterceptor.isAccessingWhitelistedRoute = () => false;
        });

        it('returning a "NO_AUTHORIZATION_TOKEN_PROVIDED" error', () => {
          stubbedInterceptor.middleware(specs.req, specs.res, specs.next);

          const error = stubbedInterceptor.ERRORS.NO_AUTHORIZATION_TOKEN_PROVIDED;
          expect(stubbedInterceptor.unauthorize)
            .toHaveBeenCalledWith(error, specs.res);
        });
      });

      describe('the authorization token is invalid', () => {
        beforeEach(() => {
          stubbedInterceptor.unauthorize = jest.fn();

          specs.req.header = () => 'has-provided-an-authorization-header';

          stubbedInterceptor.isAccessingWhitelistedRoute = () => false;
          stubbedInterceptor.isAccessingUsingAnValidEnvironmentToken = () => false;
          stubbedInterceptor.authenticationService.isAnValidJwtToken = () => false;
        });

        it('returning a "AUTHORIZATION_TOKEN_IS_INVALID" error', () => {
          stubbedInterceptor.middleware(specs.req, specs.res, specs.next);

          const error = stubbedInterceptor.ERRORS.AUTHORIZATION_TOKEN_IS_INVALID;
          expect(stubbedInterceptor.unauthorize)
            .toHaveBeenCalledWith(error, specs.res);
        });
      });
    });
  });
});
