const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authenticationUtil = require('./util');
const authenticationValidator = require('./validator');
const { ENVIRONMENT_VARIABLES } = require('../../internals');

const authenticationService = {
  // Dependency injection
  get authenticationValidator() { return { ...authenticationValidator }; },
  get bcrypt() { return { ...bcrypt }; },
  get ENVIRONMENT_VARIABLES() { return { ...ENVIRONMENT_VARIABLES }; },
  get jwt() { return { ...jwt }; },

  createAuthorizationTokenForUser(databaseUser) {
    const plainUser = databaseUser.toObject(); // Transforms the MongoDB user instance model into a plain object.
    const error = this.authenticationValidator.validateForCreatingAuthorizationToken(plainUser);
    if (error) throw error;

    // Export only the user public fields on the token payload.
    const { _id, __v, privateFields, ...publicFields } = plainUser;
    const payload = { id: _id, ...publicFields };
    const { options, secret } = this.ENVIRONMENT_VARIABLES.authentication;
    const token = this.jwt.sign(payload, secret, options);

    return token;
  },

  decodeToken(token) {
    const tokenWithoutBearerKeyword = authenticationUtil.getTokenWithoutBearerKeyword(token);
    const payload = this.jwt.decode(tokenWithoutBearerKeyword);

    return payload;
  },

  async encryptPassword(password) {
    const salt = 10;
    const encryptPassword = await this.bcrypt.hash(password, salt)
      .catch(() => {
        const error = this.authenticationValidator.ERRORS.PASSWORD_COULDNT_BE_ENCRYPTED;
        throw error;
      });

    return encryptPassword;
  }
};

module.exports = authenticationService;
