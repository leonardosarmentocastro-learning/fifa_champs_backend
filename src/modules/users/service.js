const { authenticationService } = require('./../authentication');
const usersModel = require('./model');
const usersValidator = require('./validator');

const usersService = {
  // Dependency injection
  get authenticationService() { return { ...authenticationService } },
  get usersModel() { return usersModel },
  get usersValidator() { return { ...usersValidator }; },

  async findOneUserBy(query) {
    try {
      const foundUser = await this.usersModel.findOne(query);
      return foundUser;
    } catch(err) {
      throw err;
    }
  },

  async signUp(user) {
    const error = this.usersValidator.validateForSignUp(user);
    const hasErrors = Boolean(error);
    if (hasErrors) {
      throw error;
    }

    const { displayName } = user.slack;
    const query = {
      slack: { displayName },
    };
    const foundUser = await this.findOneUserBy(query);
    const doesUserWithGivenDisplayNameAlreadyExists = Boolean(foundUser);
    if (doesUserWithGivenDisplayNameAlreadyExists) {
      const error = this.usersValidator.ERRORS.USER_WITH_GIVEN_DISPLAY_NAME_ALREADY_EXISTS;
      throw error;
    }

    // TODO: encrypt password
    const encryptedPassword = await this.authenticationService.encryptPassword(user.password);
    user.privateFields = { password: encryptedPassword };

    // Fix "password":
    // It is not saving it as a "privateFields.password".
    const documentUser = new this.usersModel(user);
    const savedUser = await documentUser.save();
    return savedUser;
  },
};

module.exports = usersService;
