const jwt = require('jsonwebtoken');

const { authenticationService, authenticationValidator } = require('../../');
const { sharedSchema } = require('../../../shared');

describe('[unit-test] authenticationService', () => {
  let service = null;

  beforeEach(() => {
    service = { ...authenticationService };
  });

  describe('[method] createAuthorizationTokenForUser', () => {
    const specs = {
      databaseUser: {
        toObject() {
          const plainUser = {
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
          };

          return plainUser;
        }
      },
    };

    it('returns a valid jwt token', () => {
      const token = service.createAuthorizationTokenForUser(specs.databaseUser);
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

      const token = service.createAuthorizationTokenForUser(specs.databaseUser);
      const payload = jwt.decode(token);
      expect(payload).toEqual(
        expect.not.objectContaining(unwantedFields)
      );
    });

    it('returns na error object when "databaseUser" is inconsistent', () => {
      const error = {};
      service.authenticationValidator.validateForCreatingAuthorizationToken = () => { throw error; };

      try {
        const databaseUser = {
          toObject() { return {}; },
        };
        service.createAuthorizationTokenForUser(databaseUser);
      } catch (err) {
        expect(err).toEqual(error);
      }
    });
  });

  describe('[method] decodeToken', () => {
    const specs = {
      jwtKeys: ['iat', 'exp'],
      databaseUser: {
        toObject() {
          const plainUser = {
            _id: '123',
            email: 'test@test.com',
            ...sharedSchema.obj,
          };

          return plainUser;
        },
      },
    };
    const expectationsForTest = (payload) => {
      const plainUser = specs.databaseUser.toObject();
      expect(payload).toHaveProperty('id', plainUser._id);
      expect(payload).toHaveProperty('email', plainUser.email);

      Object.keys(sharedSchema.obj)
        .forEach(key => expect(payload).toHaveProperty(key));
      specs.jwtKeys
        .forEach(key => expect(payload).toHaveProperty(key));
    };

    describe('by receiving a token containing the "Bearer" keyword', () => {
      it('must return the jwt token payload', () => {
        const token = service.createAuthorizationTokenForUser(specs.databaseUser);
        const tokenWithBearerKeyword = `Bearer ${token}`;
        const payload = service.decodeToken(tokenWithBearerKeyword);

        expectationsForTest(payload);
      });
    });

    describe('by receiving a token that doesn\'t contain the "Bearer" keyword', () => {
      it('must return the jwt token payload', () => {
        const token = service.createAuthorizationTokenForUser(specs.databaseUser);
        const payload = service.decodeToken(token);

        expectationsForTest(payload);
      });
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
