const healthRouter = require('./../modules/health/router');
const usersRouter = require('./../modules/users/router');

const router = {
  connect(app) {
    healthRouter.connect(app);
    usersRouter.connect(app);
  },
};

module.exports = router;
