const healthController = require('./controller');

const healthRouter = {
  connect(app) {
    app.route('/api/health')
      .get(healthController.get);
  },
};

module.exports = healthRouter;
