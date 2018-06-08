const Webserver = require('./src/webserver');

(async () => {
  try {
    const webserver = new Webserver();
    return await webserver.start();
  } catch(error) {
    console.error(error);
  }
})();
