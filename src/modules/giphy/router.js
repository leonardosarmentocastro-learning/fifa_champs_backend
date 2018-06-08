const controller = require('./controller');

const router = {
  connect(app) {
    app.route('/gifs/random')
      .get(controller.getListOfRandomGifs);
  },
};

module.exports = router;
