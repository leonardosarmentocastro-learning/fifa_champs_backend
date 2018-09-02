const usersService = require('./service');

const usersController = {
  async signUp(req, res) {
    try {
      const user = req.body;
      const savedUser = await usersService.signUp(user);

      // TODO: Create authorization token and attach it to the response's headers.
      return res.status(200).end();
    } catch(err) {
      return res.status(500).json(err);
    }
  },
};

module.exports = usersController;