const usersModel = require('./model');
const usersValidator = require('./validator');
const { authenticationService } = require('./../authentication');

const usersService = {
  // Dependency injection
  get authenticationService() { return { ...authenticationService }; },
  get usersModel() { return usersModel; },
  get usersValidator() { return { ...usersValidator }; },

  async signUp(user) {
    const error = await this.usersValidator.validateForSignUp(user);
    if (error) throw error;

    const encryptedPassword = await this.authenticationService.encryptPassword(user.password);
    user.privateFields = { password: encryptedPassword };

    const documentUser = new this.usersModel(user);
    const savedUser = (await documentUser.save()).toObject();
    const token = authenticationService.createAuthorizationTokenForUser(savedUser);

    return token;
  },
};

module.exports = usersService;
