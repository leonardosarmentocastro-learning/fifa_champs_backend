const authenticationValidator = {
  get ERRORS() {
    return {
      CANT_ENCRYPT_PASSWORD: {
        code: 'CANT_ENCRYPT_PASSWORD',
        message: 'Something went wrong while trying to encrypt the given password.',
      },
    };
  },
};

module.exports = authenticationValidator;
