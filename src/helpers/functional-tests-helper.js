const axios = require('axios');

const ENVIRONMENT_VARIABLES = require('../internals/environment-variables');
const Webserver = require('../webserver');

const webserver = new Webserver();
const functionalTestsHelper = {
  // Returns an "axios" instance which baseURL points to our API endpoint.
  API: (() => {
    const {
      authentication,
      ip,
      port,
    } = ENVIRONMENT_VARIABLES;

    const instance = axios.create({
      baseURL: `http://${ip}:${port}`,
      headers: {
        Authorization: authentication.token,
      },
    });

    // Intercept all API calls during tests so API documentation can be generated automatically.
    // TODO.

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
