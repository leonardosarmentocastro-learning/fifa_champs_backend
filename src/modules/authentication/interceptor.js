const { APP_CONFIG } = require('../../internals/configs');
const authenticationService = require('../../modules/authentication/service');

const authenticationInterceptor = {
  // Injecting dependencies / properties
  get APP_CONFIG() { return { ...APP_CONFIG }; },
  get authenticationService() { return { ...authenticationService }; },
  get ERRORS() {
    return {
      AUTHORIZATION_TOKEN_IS_INVALID: {
        code: 'AUTHORIZATION_TOKEN_IS_INVALID',
        message: 'The provided "Authorization" token is invalid.',
      },
      NO_AUTHORIZATION_TOKEN_PROVIDED: {
        code: 'NO_AUTHORIZATION_TOKEN_PROVIDED',
        message: 'No "Authorization" token was provided on the request\'s header.',
      },
    };
  },

  // Implementations
  connect(app) {
    // We bind "this" because otherwise it will refer to "express.js" context.
    app.use(this.middleware.bind(this));
  },

  isAccessingUsingAnValidEnvironmentToken(token) {
    const isAccessingUsingAnValidEnvironmentToken = true;

    // Environment tokens are not allowed in production mode.
    const { IS_PRODUCTION_ENVIRONMENT } = this.APP_CONFIG;
    if (IS_PRODUCTION_ENVIRONMENT) {
      return !isAccessingUsingAnValidEnvironmentToken;
    }

    const { authentication: environment } = this.APP_CONFIG;
    if (token === environment.token) {
      return isAccessingUsingAnValidEnvironmentToken;
    }

    return !isAccessingUsingAnValidEnvironmentToken;
  },

  isAccessingWhitelistedRoute(method, url) {
    const isCorsVerification = (method === 'OPTIONS');
    const isSigningInUsers = (method === 'POST' && url === '/users/sign_in');
    const isSigningUpUsers = (method === 'POST' && url === '/users/sign_up');

    const isAccessingWhitelistedRoute = (
      isCorsVerification ||
      isSigningInUsers ||
      isSigningUpUsers
    );
    return isAccessingWhitelistedRoute;
  },

  middleware(req, res, next) {
    const authorize = next;
    const token = req.header('Authorization');

    const { method, url } = req;
    const isAccessingWhitelistedRoute = this.isAccessingWhitelistedRoute(method, url);
    if (isAccessingWhitelistedRoute) {
      return authorize();
    }

    const hasProvidedAnAuthorizationToken = Boolean(token);
    if (!hasProvidedAnAuthorizationToken) {
      const error = this.ERRORS.NO_AUTHORIZATION_TOKEN_PROVIDED;
      return this.unauthorize(error, res);
    }

    const isAccessingUsingAnValidEnvironmentToken =
      this.isAccessingUsingAnValidEnvironmentToken(token);
    if (isAccessingUsingAnValidEnvironmentToken) {
      return authorize();
    }

    const isAnValidJwtToken = this.authenticationService.isAnValidJwtToken(token);
    if (isAnValidJwtToken) {
      return authorize();
    }

    const error = this.ERRORS.AUTHORIZATION_TOKEN_IS_INVALID;
    return this.unauthorize(error, res);
  },

  unauthorize(error, res) {
    return res.status(401).json(error);
  },
};

module.exports = authenticationInterceptor;
