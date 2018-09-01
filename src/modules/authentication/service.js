const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { ENVIRONMENT_VARIABLES } = require('../../internals');
const authenticationValidator = require('./validator');

const authenticationService = {
  // Injecting dependencies
  get authenticationValidator() { return { ...authenticationValidator }; },
  get bcrypt() { return { ...bcrypt }; },
  get ENVIRONMENT_VARIABLES() { return { ...ENVIRONMENT_VARIABLES }; },
  get jwt() { return { ...jwt }; },

  async doesEncryptedAndUnencryptedValuesMatch(encryptedValue, unencryptedValue) {
    return await this.bcrypt.compare(unencryptedValue, encryptedValue);
  },

  async encryptPassword(password) {
    const salt = 10;
    const encryptPassword = await this.bcrypt.hash(password, salt)
      .catch(err => {
        const error = this.authenticationValidator.ERRORS.CANT_ENCRYPT_PASSWORD;
        throw error;
      });

    return encryptPassword;
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

  isAnValidJwtToken(token) {
    const isAnValidJwtToken = true;
    const tokenWithoutBearerKeyword = this.getTokenWithoutBearerKeyword(token);

    try {
      const { authentication } = this.ENVIRONMENT_VARIABLES;
      this.jwt.verify(tokenWithoutBearerKeyword, authentication.secret);

      return isAnValidJwtToken;
    } catch (err) {
      return !isAnValidJwtToken;
    }
  },
};

module.exports = authenticationService;
