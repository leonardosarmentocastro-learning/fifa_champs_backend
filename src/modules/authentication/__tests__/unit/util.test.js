const { authenticationUtil } = require('../..');

describe('[unit-test] authenticationValidator', () => {
  let util = null;

  beforeEach(() => {
    util = { ...authenticationUtil };
  });

  describe('[method] getTokenWithoutBearerKeyword', () => {
    describe('by receiving a token without the "Bearer" keyword', () => {
      const specs = { tokenWithoutBearerKeyword: '123456.789.abc' };

      it('it must return the token value\'s unchanged', () => {
        const token = util.getTokenWithoutBearerKeyword(specs.tokenWithoutBearerKeyword);
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
          const token = util.getTokenWithoutBearerKeyword(specs.tokenWithBearerKeyword);
          expect(token).toBe(specs.tokenWithoutBearerKeyword);
        });
      });
    });
  });
});
