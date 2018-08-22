const healthController = {
  get(req, res) {
    return res.json({ status: 'OK' });
  },
};

module.exports = healthController;
