const { authenticationService } = require('./../authentication');
const usersModel = require('./model');
const usersValidator = require('./validator');

const usersService = {
  // Dependency injection
  get authenticationService() { return { ...authenticationService } },
  get usersModel() { return usersModel },
  get usersValidator() { return { ...usersValidator }; },

  async signUp(user) {
    const error = await this.usersValidator.validateForSignUp(user);
    const hasErrors = Boolean(error);
    if (hasErrors) {
      throw error;
    }

    const encryptedPassword = await this.authenticationService.encryptPassword(user.password);
    user.privateFields = { password: encryptedPassword };

    const documentUser = new this.usersModel(user);
    const savedUser = await documentUser.save();
    return savedUser;
  },
};

module.exports = usersService;
