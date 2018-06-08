const axios = require('axios');

const { APP_CONFIG } = require('../internals/configs');
const Webserver = require('../webserver');

const webserver = new Webserver();
const functionalTestsHelper = {
  // Returns an "axios" instance which baseURL points to our API endpoint.
  API: (() => {
    const {
      ip,
      port,
    } = APP_CONFIG;

    const instance = axios.create({
      baseURL: `http://${ip}:${port}`,
    });
    return instance;
  })(),
  closeWebserver() {
    return webserver.close();
  },
  startWebserver() {
    return webserver.start();
  },
};

module.exports = functionalTestsHelper;
