const { DateTime } = require('luxon');

const usersModel = require('./model');
const usersValidator = require('./validator');
const { authenticationService } = require('./../authentication');

const usersService = {
  // Dependency injection
  get authenticationService() { return { ...authenticationService }; },
  get usersModel() { return usersModel; },
  get usersValidator() { return { ...usersValidator }; },

  async createNewAuthorizationToken(token) {
    const authenticatedUser = authenticationService.decodeToken(token);
    const databaseUser = await this.usersModel.findById(authenticatedUser.id);

    const error = this.usersValidator.validateForCreatingNewAuthorizationToken(databaseUser);
    if (error) throw error;

    const lastTimeAuthenticatedUserWasUpdated = DateTime.fromISO(authenticatedUser.updatedAt.isoDate).valueOf();
    const lastTimeDatabaseUserWasUpdated = DateTime.fromISO(databaseUser.updatedAt.isoDate).valueOf();
    const hasToCreateNewAuthorizationTokenForUser =
      (lastTimeAuthenticatedUserWasUpdated < lastTimeDatabaseUserWasUpdated);

    const newAuthorizationToken = (hasToCreateNewAuthorizationTokenForUser ?
      authenticationService.createAuthorizationTokenForUser(databaseUser) : '');
    return newAuthorizationToken;
  },

  async signUp(user) {
    const error = await this.usersValidator.validateForSignUp(user);
    if (error) throw error;

    const encryptedPassword = await this.authenticationService.encryptPassword(user.password);
    user.privateFields = { password: encryptedPassword };

    const documentUser = new this.usersModel(user);
    const databaseUser = (await documentUser.save());
    const token = authenticationService.createAuthorizationTokenForUser(databaseUser);

    return token;
  },
};

module.exports = usersService;
