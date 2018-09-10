const { isEmpty } = require('lodash/lang');
const isEmail = require('validator/lib/isEmail');

const usersModel = require('./model');

const usersValidator = {
  // Dependency injection
  get usersModel() { return usersModel; },

  get constraints() {
    return {
      password: {
        regex: /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        // TODO: Maybe needs refactor.
        rules: `Requer ao menos 8 caracteres, sendo:
        . 1 caractere especial
        . 1 letra maiúscula
        . 1 letra minúscula`,
      },
      username: {
        maxlength: 16,
      },
    };
  },
  get ERRORS() {
    return {
      EMAIL_ALREADY_IN_USE: {
        code: 'EMAIL_ALREADY_IN_USE',
        message: 'The provided "user.email" is already in use.',
      },
      EMAIL_NOT_PROVIDED: {
        code: 'EMAIL_NOT_PROVIDED',
        message: 'The property "user.email" can\'t be empty.',
      },
      EMAIL_NOT_VALID: {
        code: 'EMAIL_NOT_VALID',
        message: 'The provided "user.email" is not valid.',
      },
      PASSWORD_NOT_PROVIDED: {
        code: 'PASSWORD_NOT_PROVIDED',
        message: 'The property "user.password" can\'t be empty.',
      },
      PASSWORD_NOT_STRONG_ENOUGH: {
        code: 'PASSWORD_NOT_STRONG_ENOUGH',
        message: 'The provided "password" is not strong enough.',
      },
      USER_IS_EMPTY: {
        code: 'USER_IS_EMPTY',
        message: 'The provided "user" payload can\'t be empty.',
      },
      USERNAME_ALREADY_IN_USE: {
        code: 'USERNAME_ALREADY_IN_USE',
        message: 'The provided "user.username" is already in use.',
      },
      USERNAME_NOT_PROVIDED: {
        code: 'USERNAME_NOT_PROVIDED',
        message: 'The property "user.username" can\'t be empty.',
      },
      USERNAME_TOO_LONG: {
        code: 'USERNAME_TOO_LONG',
        message: 'The provided "user.username" is too long.',
      },
    };
  },

  async isEmailAlreadyInUse(email) {
    try {
      const foundUser = await this.usersModel.findOne({ email });
      const hasFoundAnUser = Boolean(foundUser);
      if (hasFoundAnUser) {
        return true;
      }

      return false;
    } catch (err) {
      throw err;
    }
  },

  async isUsernameAlreadyInUse(username) {
    try {
      const foundUser = await this.usersModel.findOne({ username });
      const hasFoundAnUser = Boolean(foundUser);
      if (hasFoundAnUser) {
        return true;
      }

      return false;
    } catch (err) {
      throw err;
    }
  },

  async validateForSignUp(user) {
    if (isEmpty(user)) {
      const error = this.ERRORS.USER_IS_EMPTY;
      return error;
    }

    const { email, password, username } = user;

    // username
    const hasUsername = Boolean(username);
    if (!hasUsername) {
      const error = this.ERRORS.USERNAME_NOT_PROVIDED;
      return error;
    }

    const isUsernameTooLong = (username.length > this.constraints.username.maxlength);
    if (isUsernameTooLong) {
      const error = this.ERRORS.USERNAME_TOO_LONG;
      return error;
    }

    const isUsernameAlreadyInUse = await this.isUsernameAlreadyInUse(username);
    if (isUsernameAlreadyInUse) {
      const error = this.ERRORS.USERNAME_ALREADY_IN_USE;
      return error;
    }

    // email
    const hasEmail = Boolean(email);
    if (!hasEmail) {
      const error = this.ERRORS.EMAIL_NOT_PROVIDED;
      return error;
    }

    if (!isEmail(email)) {
      const error = this.ERRORS.EMAIL_NOT_VALID;
      return error;
    }

    const isEmailAlreadyInUse = await this.isEmailAlreadyInUse(email);
    if (isEmailAlreadyInUse) {
      const error = this.ERRORS.EMAIL_ALREADY_IN_USE;
      return error;
    }

    // password
    const hasPassword = Boolean(password);
    if (!hasPassword) {
      const error = this.ERRORS.PASSWORD_NOT_PROVIDED;
      return error;
    }

    const { regex } = this.constraints.password;
    const isPasswordStrongEnough = regex.test(password);
    if (!isPasswordStrongEnough) {
      const error = this.ERRORS.PASSWORD_NOT_STRONG_ENOUGH;
      return error;
    }

    return null;
  },
};

module.exports = usersValidator;
