const { DateTime } = require('luxon');

const usersService = require('./service');
const usersValidator = require('./validator');

const usersController = {
  constraints(req, res) {
    const { constraints } = usersValidator;
    constraints.expirationDate = DateTime.local().plus({ hours: 32 }).toISO();

    return res.status(200).json(constraints);
  },

  async me(req, res) {
    try {
      const header = 'Authorization';
      const token = req.get(header);
      const newAuthorizationToken = await usersService.createNewAuthorizationToken(token);
      res.set(header, (newAuthorizationToken || token));

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
