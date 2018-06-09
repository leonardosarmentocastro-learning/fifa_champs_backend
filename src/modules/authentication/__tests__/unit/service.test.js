const authenticationService = require('../../service');

describe('[unit-test] authenticationService', () => {
  let stubbedService = null;

  beforeEach(() => {
    stubbedService = { ...authenticationService };
  });

  describe('[method] getTokenWithoutBearerKeyword', () => {
    describe('by receiving a token without the "Bearer" keyword', () => {
      const specs = {
        tokenWithoutBearerKeyword: '123456.789.abc'
      };

      it('it must return the token value\'s unchanged', () => {
        const token = authenticationService.getTokenWithoutBearerKeyword(specs.tokenWithoutBearerKeyword);
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
          const token = authenticationService.getTokenWithoutBearerKeyword(specs.tokenWithBearerKeyword);
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
