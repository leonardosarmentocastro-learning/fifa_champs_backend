const authenticationInterceptor = require('../../interceptor');

describe('[unit-test] authenticationInterceptor', () => {
  let stubbedInterceptor = null;

  beforeEach(() => {
    stubbedInterceptor = { ...authenticationInterceptor };
  });

  describe('[method] isAccessingUsingAnValidEnvironmentToken', () => {
    describe('if the current application environment is "production"', () => {
      const specs = {
        token: 'environment-tokens-are-not-allowed-in-production-mode',
      };

      beforeEach(() => {
        stubbedInterceptor.APP_CONFIG.IS_PRODUCTION_ENVIRONMENT = true;
      });

      it('it must return a "false" boolean', () => {
        const isAccessingUsingAnValidEnvironmentToken =
          authenticationInterceptor.isAccessingUsingAnValidEnvironmentToken(specs.token);

        expect(isAccessingUsingAnValidEnvironmentToken).toBeFalsy();
      });
    });

    describe('if the current application environment is "development" or "test"', () => {
      const specs = {
        token: 'environment-token',
        notEnvironmentToken: 'not-environment-token',
      };

      beforeEach(() => {
        stubbedInterceptor.APP_CONFIG.IS_DEVELOPMENT_ENVIRONMENT = true;
        stubbedInterceptor.APP_CONFIG.IS_TEST_ENVIRONMENT = true;
        stubbedInterceptor.APP_CONFIG.IS_PRODUCTION_ENVIRONMENT = false;
      });

      describe('and the provided "token" matches the "environment token"', () => {
        beforeEach(() => {
          stubbedInterceptor.APP_CONFIG.authentication.token = specs.token;
        });

        it('it must return a "true" boolean', () => {
          const isAccessingUsingAnValidEnvironmentToken =
            authenticationInterceptor.isAccessingUsingAnValidEnvironmentToken(specs.token);

          expect(isAccessingUsingAnValidEnvironmentToken).toBeTruthy();
        });
      });

      describe('and the provided "token" does not match the "environment token"', () => {
        beforeEach(() => {
          stubbedInterceptor.APP_CONFIG.authentication.token = specs.notEnvironmentToken;
        });

        it('it must return a "false" boolean', () => {
          const isAccessingUsingAnValidEnvironmentToken =
            authenticationInterceptor.isAccessingUsingAnValidEnvironmentToken(specs.token);

          expect(isAccessingUsingAnValidEnvironmentToken).toBeFalsy();
        });
      });
    });
  });
});
