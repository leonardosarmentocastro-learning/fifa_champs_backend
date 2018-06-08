const giphyRouter = require('./../modules/giphy/router');
const helloWorldRouter = require('./../modules/hello-world/router');

const router = {
  connect(app) {
    giphyRouter.connect(app);
    helloWorldRouter.connect(app);
  },
};

module.exports = router;
