const helloWorldController = {
  getHelloWorld(req, res) {
    return res.json({ message: 'Hello world' });
  },
};

module.exports = helloWorldController;
