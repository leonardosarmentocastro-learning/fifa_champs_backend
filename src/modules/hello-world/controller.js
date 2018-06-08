const controller = {
  getHelloWorld(req, res) {
    return res.json({ message: 'Hello world' });
  },
};

module.exports = controller;
