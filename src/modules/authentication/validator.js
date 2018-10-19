const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isEmpty } = require('lodash/lang');
const { difference } = require('lodash/array');

const { ENVIRONMENT_VARIABLES } = require('../../internals');
const { sharedSchema } = require('../shared');

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
      PASSWORD_COULDNT_BE_ENCRYPTED: {
        code: 'PASSWORD_COULDNT_BE_ENCRYPTED',
        message: 'Something went wrong while trying to encrypt the given password.',
      },
      TOKEN_HAS_EXPIRED: {
        code: 'TOKEN_HAS_EXPIRED',
        message: 'The provided "token" has already expired. Please, log in again.',
      },
      TOKEN_IS_EMPTY: {
        code: 'TOKEN_IS_EMPTY',
        message: 'The provided "token" argument can\'t be empty.',
      },
      TOKEN_IS_INVALID: {
        code: 'TOKEN_IS_INVALID',
        message: 'The provided "token" is not a valid JWT token.',
      },
      TOKEN_PAYLOAD: {
        ID_NOT_PROVIDED: {
          code: 'ID_NOT_PROVIDED',
          message: 'The property "user._id" on token payload can\'t be empty.',
        },
        SHARED_SCHEMA_PROPERTIES_NOT_PROVIDED: {
          code: 'SHARED_SCHEMA_PROPERTIES_NOT_PROVIDED',
          message: 'The properties from "sharedSchema" on token\'s payload can\'t be empty.',
          misc: [],
        },
        USER_IS_EMPTY: {
          code: 'USER_IS_EMPTY',
          message: 'The provided "user" argument can\'t be empty.',
        },
      },
    };
  },

  async doesEncryptedAndUnencryptedValuesMatch(encryptedValue, unencryptedValue) {
    return this.bcrypt.compare(unencryptedValue, encryptedValue);
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
      IS_PRODUCTION_ENVIRONMENT,
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
    const isGettingUsersConstraints = (method === 'GET' && url === '/api/users/constraints');
    const isSigningInUsers = (method === 'POST' && url === '/api/users/sign-in');
    const isSigningUpUsers = (method === 'POST' && url === '/api/users/sign-up');

    return (
      isCorsVerification ||
      isCheckingServerHealthiness ||
      isGettingUsersConstraints ||
      isSigningInUsers ||
      isSigningUpUsers
    );
  },

  hasJwtTokenExpired(tokenWithoutBearerKeyword) {
    const { authentication } = this.ENVIRONMENT_VARIABLES;

    try {
      this.jwt.verify(tokenWithoutBearerKeyword, authentication.secret);
      return false;
    } catch (err) {
      return (err.name === 'TokenExpiredError');
    }
  },

  isAnValidJwtToken(tokenWithoutBearerKeyword) {
    const { authentication } = this.ENVIRONMENT_VARIABLES;

    try {
      this.jwt.verify(tokenWithoutBearerKeyword, authentication.secret);
      return true;
    } catch (err) {
      return false;
    }
  },

  validateForCreatingAuthorizationToken(savedUser) {
    if (isEmpty(savedUser)) {
      const error = this.ERRORS.TOKEN_PAYLOAD.USER_IS_EMPTY;
      return error;
    }

    const hasId = Boolean(savedUser._id);
    if (!hasId) {
      const error = this.ERRORS.TOKEN_PAYLOAD.ID_NOT_PROVIDED;
      return error;
    }

    const properties = difference(Object.keys(sharedSchema), Object.keys(savedUser));
    const doesContainsSharedSchemaProperties = (properties.length === 0);
    if (!doesContainsSharedSchemaProperties) {
      const error = this.ERRORS.TOKEN_PAYLOAD.SHARED_SCHEMA_PROPERTIES_NOT_PROVIDED;
      error.misc = properties;

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

    const isAccessingUsingAnValidEnvironmentToken =
      this.isAccessingUsingAnValidEnvironmentToken(token);
    if (isAccessingUsingAnValidEnvironmentToken) {
      return null;
    }

    const tokenWithoutBearerKeyword = this.getTokenWithoutBearerKeyword(token);
    const isAnValidJwtToken = this.isAnValidJwtToken(tokenWithoutBearerKeyword);
    if (!isAnValidJwtToken) {
      const error = this.ERRORS.TOKEN_IS_INVALID;
      return error;
    }

    const hasJwtTokenExpired = this.hasJwtTokenExpired(tokenWithoutBearerKeyword);
    if (!hasJwtTokenExpired) {
      const error = this.ERRORS.TOKEN_HAS_EXPIRED;
      return error;
    }

    return null;
  },
};

module.exports = authenticationValidator;
