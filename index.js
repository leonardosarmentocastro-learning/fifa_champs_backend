const Webserver = require('./src/webserver');

try {
  const webserver = new Webserver();
  webserver.start();
} catch(error) {
  console.error(error);
}
