const axios = require('axios');
const axiosApiDocGenerator = require('axios-api-doc-generator');

const { ENVIRONMENT_VARIABLES } = require('../internals');
const { Webserver } = require('../webserver');

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
    instance.interceptors.request.use(axiosApiDocGenerator.requestInterceptor.onSuccess);
    instance.interceptors.response.use(
      axiosApiDocGenerator.responseInterceptor.onSuccess,
      axiosApiDocGenerator.responseInterceptor.onError
    );

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
