const { authenticationService, authenticationValidator } = require('../../');

describe('[unit-test] authenticationService', () => {
  let stubbedService = null;

  beforeEach(() => {
    stubbedService = { ...authenticationService };
  });

  describe('[method] doesEncryptedAndUnencryptedValuesMatch', () => {
    it('it must return "true" when the "encryptedValue" corresponds to the provided "unencryptedValue"', async () => {
      const unencryptedValue = '1q2w#E$R';
      const encryptedValue = await stubbedService.encryptPassword(unencryptedValue);

      const doesEncryptedAndUnencryptedValuesMatch = await stubbedService.doesEncryptedAndUnencryptedValuesMatch(encryptedValue, unencryptedValue);
      expect(doesEncryptedAndUnencryptedValuesMatch).toBeTruthy();
    });

    it('it must return "false" when the "encryptedValue" does not corresponds to the provided "unencryptedValue"', async () => {
      const unencryptedValue = '1q2w#E$R';
      const encryptedValue = await stubbedService.encryptPassword(unencryptedValue);

      const notUnencryptedValue = '12345678';
      const doesEncryptedAndUnencryptedValuesMatch = await stubbedService.doesEncryptedAndUnencryptedValuesMatch(encryptedValue, notUnencryptedValue);
      expect(doesEncryptedAndUnencryptedValuesMatch).toBeFalsy();
    });
  });

  describe('[method] encryptPassword', () => {
    it('returns an encrypted value', async () => {
      const password = '1q2w#E$R';
      const encryptedPassword = await stubbedService.encryptPassword(password);

      expect(password).not.toBe(encryptedPassword);
    });

    it('returns an error object when can\'t encrypt the password', async () => {
      stubbedService.bcrypt.hash = () => { throw authenticationValidator.ERRORS.CANT_ENCRYPT_PASSWORD; };

      const password = '1q2w#E$R';
      return await stubbedService.encryptPassword(password)
        .catch(error => {
          expect(error).toEqual(authenticationValidator.ERRORS.CANT_ENCRYPT_PASSWORD);
        });
    });
  });

  describe('[method] getTokenWithoutBearerKeyword', () => {
    describe('by receiving a token without the "Bearer" keyword', () => {
      const specs = {
        tokenWithoutBearerKeyword: '123456.789.abc',
      };

      it('it must return the token value\'s unchanged', () => {
        const token = authenticationService
          .getTokenWithoutBearerKeyword(specs.tokenWithoutBearerKeyword);
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
          const token = authenticationService
            .getTokenWithoutBearerKeyword(specs.tokenWithBearerKeyword);
          expect(token).toBe(specs.tokenWithoutBearerKeyword);
        });
      });
    });
  });

  describe('[method] isAnValidJwtToken', () => {
    describe('by receiving an invalid jwt token', () => {
      const specs = {
        token: 'invalid.jwt.token',
      };

      beforeEach(() => {
        stubbedService.jwt.verify = () => {
          throw new Exception('Invalid token.');
        };
      });

      it('it must return "false" boolean value', () => {
        expect(stubbedService.isAnValidJwtToken(specs.token))
          .toBeFalsy();
      });
    });

    describe('by receiving a valid jwt token', () => {
      const specs = {
        token: 'valid.jwt.token',
      };

      beforeEach(() => {
        stubbedService.jwt.verify = () => null;
      });

      it('it must return "true" boolean value', () => {
        expect(stubbedService.isAnValidJwtToken(specs.token))
          .toBeTruthy();
      });
    });
  });
});
