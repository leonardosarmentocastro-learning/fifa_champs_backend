const { authenticationService, authenticationValidator } = require('../../');

describe('[unit-test] authenticationService', () => {
  let service = null;

  beforeEach(() => {
    service = { ...authenticationService };
  });

  describe('[method] encryptPassword', () => {
    it('returns an encrypted value', async () => {
      const password = '1q2w#E$R';
      const encryptedPassword = await service.encryptPassword(password);

      expect(password).not.toBe(encryptedPassword);
    });

    it('returns an error object when can\'t encrypt the password', async () => {
      const err = authenticationValidator.ERRORS.PASSWORD_COULDNT_BE_ENCRYPTED;
      service.bcrypt.hash = () => { throw err; };

      const password = '1q2w#E$R';
      await service.encryptPassword(password)
        .catch((error) => {
          expect(error).toEqual(err);
        });
    });
  });
});
