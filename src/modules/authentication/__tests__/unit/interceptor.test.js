describe('[unit-test] authenticationInterceptor', () => {
  describe('[method] isAccessingUsingAnValidEnvironmentToken', () => {
    describe('if the current application environment is "production"', () => {
      it('it must return a "false" boolean', () => {

      });
    });

    describe('if the current application environment is "development" or "test"', () => {
      describe('and the provided "token" matches the "environment token"', () => {
        it('it must return a "true" boolean', () => {

        });
      });

      describe('and the provided "token" does not match the "environment token"', () => {
        it('it must return a "true" boolean', () => {

        });
      });
    });
  });
});
