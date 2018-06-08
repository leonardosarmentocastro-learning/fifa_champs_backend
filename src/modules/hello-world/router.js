const controller = require('./controller');

const router = {
  connect(app) {
    app.route('/hello-world')
      .get(controller.getHelloWorld);
  },
};

module.exports = router;
