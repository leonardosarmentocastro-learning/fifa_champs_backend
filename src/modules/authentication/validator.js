const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isEmpty } = require('lodash/lang');

const { ENVIRONMENT_VARIABLES } = require('../../internals');

const authenticationValidator = {
  // Dependency injection
  get bcrypt() { return { ...bcrypt }; },
  get ENVIRONMENT_VARIABLES() { return { ...ENVIRONMENT_VARIABLES }; },
  get jwt() { return { ...jwt }; },

  get ERRORS() {
    return {
      AUTHORIZATION_TOKEN_NOT_PROVIDED: {
        code: 'AUTHORIZATION_TOKEN_NOT_PROVIDED',
        message: 'No authorization token was provided on the request\'s header.',
      },
      ID_NOT_PROVIDED: {
        code: 'ID_NOT_PROVIDED',
        message: 'The property "user._id" can\'t be empty.',
      },
      PASSWORD_COULDNT_BE_ENCRYPTED: {
        code: 'PASSWORD_COULDNT_BE_ENCRYPTED',
        message: 'Something went wrong while trying to encrypt the given password.',
      },
      TOKEN_IS_EMPTY: {
        code: 'TOKEN_IS_EMPTY',
        message: 'The provided "token" argument can\'t be empty.',
      },
      TOKEN_IS_INVALID: {
        code: 'TOKEN_IS_INVALID',
        message: 'The provided "token" is not a valid JWT token.',
      },
      USER_IS_EMPTY: {
        code: 'USER_IS_EMPTY',
        message: 'The provided "user" argument can\'t be empty.',
      },
    };
  },

  async doesEncryptedAndUnencryptedValuesMatch(encryptedValue, unencryptedValue) {
    return await this.bcrypt.compare(unencryptedValue, encryptedValue);
  },

  getTokenWithoutBearerKeyword(token) {
    const keyword = 'Bearer';
    const doesTokenHasBearerKeyword = (token.indexOf(keyword) !== -1);
    if (!doesTokenHasBearerKeyword) {
      return token;
    }

    const content = token.split(keyword); // ['', ' 123456.aaa.bbb']
    let [, tokenWithoutBearerKeyword] = content; // ' 123456.aaa.bbb'
    tokenWithoutBearerKeyword = tokenWithoutBearerKeyword.trim(); // '123456.aaa.bbb'

    return tokenWithoutBearerKeyword;
  },

  isAccessingUsingAnValidEnvironmentToken(token) {
    const {
      authentication: environment,
      IS_PRODUCTION_ENVIRONMENT
    } = this.ENVIRONMENT_VARIABLES;

    // Environment tokens are not allowed in production mode.
    if (IS_PRODUCTION_ENVIRONMENT) {
      return false;
    }

    return (token === environment.token);
  },

  isAccessingWhitelistedRoute(method, url) {
    const isCorsVerification = (method === 'OPTIONS');
    const isCheckingServerHealthiness = (method === 'GET' && url === '/api/health');
    const isSigningInUsers = (method === 'POST' && url === '/api/users/sign-in');
    const isSigningUpUsers = (method === 'POST' && url === '/api/users/sign-up');

    return (
      isCorsVerification ||
      isCheckingServerHealthiness ||
      isSigningInUsers ||
      isSigningUpUsers
    );
  },

  isAnValidJwtToken(token) {
    const tokenWithoutBearerKeyword = this.getTokenWithoutBearerKeyword(token);
    const { authentication } = this.ENVIRONMENT_VARIABLES;

    try {
      this.jwt.verify(tokenWithoutBearerKeyword, authentication.secret);
      return true;
    } catch (err) {
      return false;
    }
  },

  validateForAttachingTokenOnResponse(token) {
    if (isEmpty(token)) {
      const error = this.ERRORS.USER_IS_EMPTY;
      return error;
    }

    const isAnValidJwtToken = this.isAnValidJwtToken(token);
    if (!isAnValidJwtToken) {
      const error = this.ERRORS.TOKEN_IS_INVALID;
      return error;
    }

    return null;
  },

  validateForCreatingAuthorizationToken(savedUser) {
    if (isEmpty(savedUser)) {
      const error = this.ERRORS.USER_IS_EMPTY;
      return error;
    }

    const hasId = Boolean(savedUser._id);
    if (!hasId) {
      const error = this.ERRORS.ID_NOT_PROVIDED;
      return error;
    }

    return null;
  },

  validateForMiddlewareAuthorization(req) {
    const { method, url } = req;
    const token = req.header('Authorization');

    const isAccessingWhitelistedRoute = this.isAccessingWhitelistedRoute(method, url);
    if (isAccessingWhitelistedRoute) {
      return null;
    }

    const hasAuthorizationToken = Boolean(token);
    if (!hasAuthorizationToken) {
      const error = this.ERRORS.AUTHORIZATION_TOKEN_NOT_PROVIDED;
      return error;
    }

    const isAccessingUsingAnValidEnvironmentToken = this.isAccessingUsingAnValidEnvironmentToken(token);
    if (isAccessingUsingAnValidEnvironmentToken) {
      return null;
    }

    const isAnValidJwtToken = this.isAnValidJwtToken(token);
    if (!isAnValidJwtToken) {
      const error = this.ERRORS.TOKEN_IS_INVALID;
      return error;
    }

    return null;
  }
};

module.exports = authenticationValidator;
