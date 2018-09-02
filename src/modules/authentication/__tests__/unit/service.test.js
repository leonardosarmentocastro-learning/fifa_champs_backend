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
      service.bcrypt.hash = () => { throw authenticationValidator.ERRORS.PASSWORD_COULDNT_BE_ENCRYPTED; };

      const password = '1q2w#E$R';
      return await service.encryptPassword(password)
        .catch(error => {
          expect(error).toEqual(authenticationValidator.ERRORS.PASSWORD_COULDNT_BE_ENCRYPTED);
        });
    });
  });
});
