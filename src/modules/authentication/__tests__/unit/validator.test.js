const { authenticationService, authenticationValidator } = require('../..');

describe('[unit-test] authenticationValidator', () => {
  let validator = null;

  beforeEach(() => {
    validator = { ...authenticationValidator };
  });

  describe('[method] doesEncryptedAndUnencryptedValuesMatch', () => {
    it('it must return "true" when the "encryptedValue" corresponds to the provided "unencryptedValue"', async () => {
      const unencryptedValue = '1q2w#E$R';
      const encryptedValue = await authenticationService.encryptPassword(unencryptedValue);

      const doesEncryptedAndUnencryptedValuesMatch = await validator.doesEncryptedAndUnencryptedValuesMatch(encryptedValue, unencryptedValue);
      expect(doesEncryptedAndUnencryptedValuesMatch).toBeTruthy();
    });

    it('it must return "false" when the "encryptedValue" does not corresponds to the provided "unencryptedValue"', async () => {
      const unencryptedValue = '1q2w#E$R';
      const encryptedValue = await authenticationService.encryptPassword(unencryptedValue);

      const notUnencryptedValue = '12345678';
      const doesEncryptedAndUnencryptedValuesMatch = await validator.doesEncryptedAndUnencryptedValuesMatch(encryptedValue, notUnencryptedValue);
      expect(doesEncryptedAndUnencryptedValuesMatch).toBeFalsy();
    });
  });

  describe('[method] getTokenWithoutBearerKeyword', () => {
    describe('by receiving a token without the "Bearer" keyword', () => {
      const specs = { tokenWithoutBearerKeyword: '123456.789.abc' };

      it('it must return the token value\'s unchanged', () => {
        const token = validator.getTokenWithoutBearerKeyword(specs.tokenWithoutBearerKeyword);
        expect(token).toBe(specs.tokenWithoutBearerKeyword);
      });
    });

    describe('by receiving a token with the "Bearer" keyword', () => {
      describe('(e.g. "Bearer 123456.789.abc")', () => {
        const specs = {
          tokenWithBearerKeyword: 'Bearer 123456.789.abc',
          tokenWithoutBearerKeyword: '123456.789.abc',
        };

        it('it must return the string after the "Bearer" keyword', () => {
          const token = validator.getTokenWithoutBearerKeyword(specs.tokenWithBearerKeyword);
          expect(token).toBe(specs.tokenWithoutBearerKeyword);
        });
      });
    });
  });

  describe('[method] isAccessingUsingAnValidEnvironmentToken', () => {
    describe('if the current application environment is "production"', () => {
      beforeEach(() => {
        validator.ENVIRONMENT_VARIABLES.IS_PRODUCTION_ENVIRONMENT = true;
      });

      it('it must return a "false" boolean', () => {
        const token = 'environment-tokens-are-not-allowed-in-production-mode';
        expect(validator.isAccessingUsingAnValidEnvironmentToken(token))
          .toBeFalsy();
      });
    });

    describe('if the current application environment is "development" or "test"', () => {
      beforeEach(() => {
        validator.ENVIRONMENT_VARIABLES.IS_DEVELOPMENT_ENVIRONMENT = true;
        validator.ENVIRONMENT_VARIABLES.IS_TEST_ENVIRONMENT = true;
        validator.ENVIRONMENT_VARIABLES.IS_PRODUCTION_ENVIRONMENT = false;
      });

      describe('and the provided "token" matches the "environment token"', () => {
        const token = 'environment-token';

        beforeEach(() => {
          validator.ENVIRONMENT_VARIABLES.authentication.token = token;
        });

        it('it must return a "true" boolean', () => {
          expect(validator.isAccessingUsingAnValidEnvironmentToken(token))
            .toBeTruthy();
        });
      });

      describe('and the provided "token" does not match the "environment token"', () => {
        const token = 'environment-token';
        const notEnvironmentToken = 'not-environment-token';

        beforeEach(() => {
          validator.ENVIRONMENT_VARIABLES.authentication.token = notEnvironmentToken;
        });

        it('it must return a "false" boolean', () => {
          expect(validator.isAccessingUsingAnValidEnvironmentToken(token))
            .toBeFalsy();
        });
      });
    });
  });

  describe('[method] isAccessingWhitelistedRoute', () => {
    describe('the following routes must be bypassed:', () => {
      it('(CORS verification) [OPTIONS] *', () => {
        expect(validator.isAccessingWhitelistedRoute('OPTIONS', ''))
          .toBeTruthy();
      });

      it('[GET] /api/health', () => {
        expect(validator.isAccessingWhitelistedRoute('GET', '/api/health'))
          .toBeTruthy();
      });

      it('[POST] /users/sign-in', () => {
        expect(validator.isAccessingWhitelistedRoute('POST', '/api/users/sign-in'))
          .toBeTruthy();
      });

      it('[POST] /users/sign-up', () => {
        expect(validator.isAccessingWhitelistedRoute('POST', '/api/users/sign-up'))
          .toBeTruthy();
      });
    });
  });

  describe('[method] isAnValidJwtToken', () => {
    describe('by receiving an invalid jwt token', () => {
      beforeEach(() => {
        validator.jwt.verify = () => {
          throw new Exception('Invalid token.');
        };
      });

      it('it must return "false" boolean value', () => {
        const token = 'invalid.jwt.token';
        expect(validator.isAnValidJwtToken(token)).toBeFalsy();
      });
    });

    describe('by receiving a valid jwt token', () => {
      beforeEach(() => {
        validator.jwt.verify = () => null;
      });

      it('it must return "true" boolean value', () => {
        const token = 'valid.jwt.token';
        expect(validator.isAnValidJwtToken(token)).toBeTruthy();
      });
    });
  });
});
