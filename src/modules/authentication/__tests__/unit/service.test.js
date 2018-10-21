const jwt = require('jsonwebtoken');

const { authenticationService, authenticationValidator } = require('../../');

describe('[unit-test] authenticationService', () => {
  let service = null;

  beforeEach(() => {
    service = { ...authenticationService };
  });

  describe('[method] createAuthorizationTokenForUser', () => {
    const specs = {
      savedUser: {
        _id : '5bcc6162e2d4c613984c1f36',
        __v: 0,
        createdAt: {
          formattedDate: 'Tuesday, 25 de September 2018',
          isoDate: '2018-09-25T16:18:12.893+02:00'
        },
        email: 'test@test.com',
        privateFields: {
          password: '$2b$10$/07N8dv58O.4rG4mAm7Kie4khPXPOlXSy47Rxm0JeMXUnXjoG.Aie'
        },
        updatedAt: {
          formattedDate: '',
          isoDate: ''
        },
        username: 'test',
      },
    };

    it('returns a valid jwt token', () => {
      const token = service.createAuthorizationTokenForUser(specs.savedUser);
      const isAnValidJwtToken = authenticationValidator.isAnValidJwtToken(token);

      expect(isAnValidJwtToken).toBeTruthy();
    });

    it('returns an token that has on its payload, an user with "id" and no "privateFields" or mongodb related fields', () => {
      const unwantedFields = {
        _id : '5baa5987c8c29b3d0b7cda69',
        __v: 0,
        privateFields: {
          password: '$2b$10$/07N8dv58O.4rG4mAm7Kie4khPXPOlXSy47Rxm0JeMXUnXjoG.Aie'
        },
      };

      const token = service.createAuthorizationTokenForUser(specs.savedUser);
      const payload = jwt.decode(token);
      expect(payload).toEqual(
        expect.not.objectContaining(unwantedFields)
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
