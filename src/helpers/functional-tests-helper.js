const axios = require('axios');
const { createAxiosInstance } = require('axios-api-doc-generator');

const { ENVIRONMENT_VARIABLES } = require('../internals');
const { Webserver } = require('../webserver');

const webserver = new Webserver();
const functionalTestsHelper = {
  // Returns an "axios" instance which baseURL points to our API endpoint.
  API: {
    withAuthentication: (() => {
      const { authentication, ip, port } = ENVIRONMENT_VARIABLES;
      const instance = createAxiosInstance({
        baseURL: `http://${ip}:${port}`,
        headers: {
          Authorization: authentication.token,
        },
      });

      return instance;
    })(),
    withoutAuthentication: (() => {
      const { ip, port } = ENVIRONMENT_VARIABLES;
      const instance = createAxiosInstance({ baseURL: `http://${ip}:${port}` });

      return instance;
    })(),
    withoutInterceptor: (() => {
      const { ip, port } = ENVIRONMENT_VARIABLES;
      const instance = axios.create({ baseURL: `http://${ip}:${port}` });

      return instance;
    })(),
  },
  closeWebserver() {
    return webserver.close();
  },
  startWebserver() {
    return webserver.start();
  },
};

module.exports = functionalTestsHelper;
