const jwt = require('jsonwebtoken');

const ENVIRONMENT_VARIABLES = require('../../internals/environment-variables');

const authenticationService = {
  // Injecting dependencies
  get ENVIRONMENT_VARIABLES() { return { ...ENVIRONMENT_VARIABLES }; },
  get jwt() { return { ...jwt }; },

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
