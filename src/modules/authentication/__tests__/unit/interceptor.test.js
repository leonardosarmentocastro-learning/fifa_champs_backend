const { authenticationInterceptor } = require('../../');

describe('[unit-test] authenticationInterceptor', () => {
  let interceptor = null;

  beforeEach(() => {
    interceptor = { ...authenticationInterceptor };
  });

  afterEach(() => jest.resetAllMocks());

  const specs = {
    req: {
      header: () => null,
      method: '',
      url: '',
    },
    res: {
      json: jest.fn(),
      status: jest.fn(),
    },
    next: jest.fn(),
  };

  describe('[method] middleware', () => {
    describe('the request must be authorized when', () => {
      describe('', () => {
        beforeEach(() => {
          interceptor.authenticationValidator.isAccessingWhitelistedRoute = () => true;
        });

        it('a whitelisted route is being accessed', () => {
          interceptor.middleware(specs.req, specs.res, specs.next);
          expect(specs.next).toHaveBeenCalledTimes(1);
        });
      });

      describe('', () => {
        beforeEach(() => {
          specs.req.header = () => 'has-provided-an-authorization-header';

          interceptor.authenticationValidator.isAccessingWhitelistedRoute = () => false;
          interceptor.authenticationValidator.isAccessingUsingAnValidEnvironmentToken = () => true;
        });

        it('and a valid environment token is being used', () => {
          interceptor.middleware(specs.req, specs.res, specs.next);
          expect(specs.next).toHaveBeenCalledTimes(1);
        });
      });

      describe('', () => {
        beforeEach(() => {
          specs.req.header = () => 'has-provided-an-authorization-header';

          interceptor.authenticationValidator.isAccessingWhitelistedRoute = () => false;
          interceptor.authenticationValidator.isAccessingUsingAnValidEnvironmentToken = () => false;
          interceptor.authenticationValidator.hasJwtTokenExpired = () => false;
          interceptor.authenticationValidator.isAnValidJwtToken = () => true;
        });

        it('or a valid JWT token is being used', () => {
          interceptor.middleware(specs.req, specs.res, specs.next);
          expect(specs.next).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('the request must be unauthorized when', () => {
      describe('', () => {
        beforeEach(() => {
          specs.req.header = () => '';
          specs.res.status = jest.fn(() => specs.res);
          interceptor.authenticationValidator.isAccessingWhitelistedRoute = () => false;
        });

        it('no authorization token was provided', () => {
          interceptor.middleware(specs.req, specs.res, specs.next);

          const error = interceptor.authenticationValidator.ERRORS.AUTHORIZATION_TOKEN_NOT_PROVIDED;
          expect(specs.res.status).toHaveBeenCalledWith(401);
          expect(specs.res.json).toHaveBeenCalledWith(error);
        });
      });

      describe('', () => {
        beforeEach(() => {
          specs.req.header = () => 'has-provided-an-authorization-header';
          specs.res.status = jest.fn(() => specs.res);

          interceptor.authenticationValidator.isAccessingWhitelistedRoute = () => false;
          interceptor.authenticationValidator.isAccessingUsingAnValidEnvironmentToken = () => false;
          interceptor.authenticationValidator.isAnValidJwtToken = () => false;
        });

        it('the authorization token is invalid', () => {
          interceptor.middleware(specs.req, specs.res, specs.next);

          const error = interceptor.authenticationValidator.ERRORS.TOKEN_IS_INVALID;
          expect(specs.res.status).toHaveBeenCalledWith(401);
          expect(specs.res.json).toHaveBeenCalledWith(error);
        });
      });

      describe('', () => {
        beforeEach(() => {
          specs.req.header = () => 'has-provided-an-authorization-header';
          specs.res.status = jest.fn(() => specs.res);

          interceptor.authenticationValidator.isAccessingWhitelistedRoute = () => false;
          interceptor.authenticationValidator.isAccessingUsingAnValidEnvironmentToken = () => false;
          interceptor.authenticationValidator.isAnValidJwtToken = () => true;
          interceptor.authenticationValidator.hasJwtTokenExpired = () => true;
        });

        it('the authorization token has expired', () => {
          interceptor.middleware(specs.req, specs.res, specs.next);

          const error = interceptor.authenticationValidator.ERRORS.TOKEN_HAS_EXPIRED;
          expect(specs.res.status).toHaveBeenCalledWith(401);
          expect(specs.res.json).toHaveBeenCalledWith(error);
        });
      });
    });
  });
});
