const jwt = require('jsonwebtoken');

const { authenticationService } = require('../../');

describe('[unit-test] authenticationService', () => {
  let service = null;

  beforeEach(() => {
    service = { ...authenticationService };
  });

  describe('[method] createAuthorizationTokenForUser', () => {
    // TODO: FIX-IT
    it('returns an token that has an user with "id" no "privateFields" or mongodb related fields on its payload', () => {
      const savedUser = {
        _id : '5baa5987c8c29b3d0b7cda69',
        createdAt: {
          formattedDate: 'Tuesday, 25 de September 2018',
          isoDate: '2018-09-25T16:18:12.893+02:00'
        },
        privateFields: {
          password: "$2b$10$/07N8dv58O.4rG4mAm7Kie4khPXPOlXSy47Rxm0JeMXUnXjoG.Aie"
        },
        email: 'test@test.com',
        username: 'test',
        __v: 0
      };

      try {
        const token = service.createAuthorizationTokenForUser(savedUser);

      } catch(err) {
        console.log(err);
      }


      const payload = jwt.decode(token);
      expect(payload).toEqual(
        expect.not.objectContaining({ __v, privateFields, _id})
      );
    });

    it('returns na error object when "savedUser" is inconsistent', () => {
      const error = {};
      service.authenticationValidator.validateForCreatingAuthorizationToken = () => { throw error; };

      try {
        const savedUser = {};
        service.createAuthorizationTokenForUser(savedUser);
      } catch (err) {
        expect(err).toEqual(error);
      }
    });
  });

  describe('[method] encryptPassword', () => {
    it('returns an encrypted value', async () => {
      const password = '1q2w#E$R';
      const encryptedPassword = await service.encryptPassword(password);

      expect(password).not.toBe(encryptedPassword);
    });

    it('returns an error object when can\'t encrypt the password', async () => {
      const err = {};
      service.bcrypt.hash = () => { throw err; };

      const password = '1q2w#E$R';
      await service.encryptPassword(password)
        .catch((error) => {
          expect(error).toEqual(err);
        });
    });
  });
});
