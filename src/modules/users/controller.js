const { DateTime } = require('luxon');

const usersService = require('./service');
const usersValidator = require('./validator');

const usersController = {
  constraints(req, res) {
    const { constraints } = usersValidator;
    constraints.expirationDate = DateTime.local().plus({ hours: 32 }).toISO();

    return res.status(200).json(constraints);
  },

  // TODO:
  // 1. get token from header
  // 2. uncode and obtain id (check if token is valid)
  // 3. search for user with that id
    // check if the user have been updated since the last time a new token was given
    // if user was not updated at all, don't return shit (so we don't update the store and avoid unnecessary re-render)
    // if it has been updated, we generate a new token and send new user information as well.
  // 4. functional tests.
  async me(req, res) {
    try {
      const token = req.get('Authorization');

      return res.status(200).end();
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  async signUp(req, res) {
    try {
      const user = req.body;
      const token = await usersService.signUp(user);
      const header = 'Authorization';
      res.set(header, token);

      return res.status(200).end();
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};

module.exports = usersController;
