const usersService = require('./service');
const usersValidator = require('./validator');
const { authenticationService } = require('../authentication');

const usersController = {
  constraints(req, res) {
    const { constraints } = usersValidator;
    constraints.password.regex = constraints.password.regex.toString();

    return res.status(200).json(constraints);
  },

  async signUp(req, res) {
    try {
      const user = req.body;
      const savedUser = await usersService.signUp(user);

      const token = authenticationService.createAuthorizationTokenForUser(savedUser);
      authenticationService.setAuthorizationTokenOnResponse(token, res);

      return res.status(200).end();
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};

module.exports = usersController;
