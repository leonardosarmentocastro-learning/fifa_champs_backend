const { authenticationService, authenticationValidator } = require('../..');
const { sharedSchema } = require('../../../shared');

describe('[unit-test] authenticationValidator', () => {
  let validator = null;

  beforeEach(() => {
    validator = { ...authenticationValidator };
  });

  describe('[method] doesEncryptedAndUnencryptedValuesMatch', () => {
    it('it must return "true" when the "encryptedValue" corresponds to the provided "unencryptedValue"', async () => {
      const unencryptedValue = '1q2w#E$R';
      const encryptedValue = await authenticationService.encryptPassword(unencryptedValue);

      const doesEncryptedAndUnencryptedValuesMatch =
        await validator.doesEncryptedAndUnencryptedValuesMatch(encryptedValue, unencryptedValue);
      expect(doesEncryptedAndUnencryptedValuesMatch).toBeTruthy();
    });

    it('it must return "false" when the "encryptedValue" does not corresponds to the provided "unencryptedValue"', async () => {
      const unencryptedValue = '1q2w#E$R';
      const encryptedValue = await authenticationService.encryptPassword(unencryptedValue);

      const notUnencryptedValue = '12345678';
      const doesEncryptedAndUnencryptedValuesMatch =
        await validator.doesEncryptedAndUnencryptedValuesMatch(encryptedValue, notUnencryptedValue);
      expect(doesEncryptedAndUnencryptedValuesMatch).toBeFalsy();
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
      const routes = [
        { method: 'OPTIONS', url: '' },
        { method: 'GET', url: '/api/health' },
        { method: 'GET', url: '/api/users/constraints' },
        { method: 'POST', url: '/api/users/sign-in' },
        { method: 'POST', url: '/api/users/sign-up' },
      ].forEach(route => {
        const { method, url } = route;

        it(`[${method}] ${url}`, () => {
          expect(validator.isAccessingWhitelistedRoute(method, url))
            .toBeTruthy();
        });
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

  describe('[method] hasJwtTokenExpired', () => {
    it('must return a "false" boolean in case the token has not expired', () => {
      validator.jwt.verify = () => null;

      const token = 'token-has-not-expired';
      const hasJwtTokenExpired = validator.hasJwtTokenExpired(token);
      expect(hasJwtTokenExpired).toBeFalsy();
    });

    it('must return a "true" boolean in case the token has expired', () => {
      validator.jwt.verify = () => {
        const err = { name: 'TokenExpiredError' };
        throw err;
      };

      const token = 'token-has-expired';
      const hasJwtTokenExpired = validator.hasJwtTokenExpired(token);
      expect(hasJwtTokenExpired).toBeTruthy();
    });
  });

  describe('[method] validateForCreatingAuthorizationToken', () => {
    it('must return null when all conditions were satisfied', () => {
      const databaseUser = {
        _id: '123',
        name: 'Leonardo',
        ...sharedSchema.obj,
      };
      const validateForCreatingAuthorizationToken = validator.validateForCreatingAuthorizationToken(databaseUser);

      expect(validateForCreatingAuthorizationToken).toBeNull();
    });

    describe('must throw an error when', () => {
      it('providing an empty "user"', () => {
        const databaseUser = {};
        const validateForCreatingAuthorizationToken = validator.validateForCreatingAuthorizationToken(databaseUser);

        expect(validateForCreatingAuthorizationToken)
          .toEqual(validator.ERRORS.TOKEN_PAYLOAD.USER_IS_EMPTY);
      });

      it('an "user" without an "id" property', () => {
        const databaseUser = { name: 'Leonardo' };
        const validateForCreatingAuthorizationToken = validator.validateForCreatingAuthorizationToken(databaseUser);

        expect(validateForCreatingAuthorizationToken)
          .toEqual(validator.ERRORS.TOKEN_PAYLOAD.ID_NOT_PROVIDED);
      });

      it('an "user" not contaning shared schema properties like "createdAt" or "updatedAt"', () => {
        const databaseUser = {  _id: '123', name: 'Leonardo' };
        const validateForCreatingAuthorizationToken = validator.validateForCreatingAuthorizationToken(databaseUser);

        expect(validateForCreatingAuthorizationToken)
          .toEqual(validator.ERRORS.TOKEN_PAYLOAD.SHARED_SCHEMA_PROPERTIES_NOT_PROVIDED);
      });
    });
  });
});
