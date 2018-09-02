const { Webserver } = require('./src/webserver');

(async () => {
  try {
    new Webserver().start();
  } catch(error) {
    console.error(error);
  }
})();
