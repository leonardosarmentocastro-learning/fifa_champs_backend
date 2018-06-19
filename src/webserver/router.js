const helloWorldRouter = require('./../modules/hello-world/router');
const usersRouter = require('./../modules/users/router');

const router = {
  connect(app) {
    helloWorldRouter.connect(app);
    usersRouter.connect(app);
  },
};

module.exports = router;
