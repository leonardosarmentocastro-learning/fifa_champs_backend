const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan');

const ENVIRONMENT_VARIABLES = require('./../internals/environment-variables');
const authenticationInterceptor = require('../modules/authentication/interceptor');

const configureWebserver = {
  bodyParser(app) {
    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.urlencoded({ extended: false }));
  },

  connectAuthenticationInterceptorMiddleware(app) {
    authenticationInterceptor.connect(app);
  },

  // Since frontend applications may be able to read the "Authorization" token and send
  // it on every request made by signed in users, we must manually allow the "front-end" origin
  // to do so, otherwise, the browser will prevent it from doing http requests that contains the
  // "Authorization" token.
  corsWithAuthorizationHeaderEnabled(app) {
    const middleware = (req, callback) => {
      const errors = null;
      const options = {
        origin: req.header('Origin'),
        credentials: true,
        exposedHeaders: ['Authorization'],
      };

      return callback(errors, options);
    };

    app.use(cors(middleware));
  },

  requestCompression: (app) => {
    app.use(compression());
  },

  logErrorsOnConsoleDependingOnEnviroment(app) {
    const { IS_DEVELOPMENT_ENVIRONMENT, IS_TEST_ENVIRONMENT } = ENVIRONMENT_VARIABLES;
    if (IS_DEVELOPMENT_ENVIRONMENT || IS_TEST_ENVIRONMENT) {
      app.use(errorhandler());
    }
  },

  logRequestsOnConsoleDependingOnEnvironment(app) {
    const { IS_DEVELOPMENT_ENVIRONMENT } = ENVIRONMENT_VARIABLES;

    if (IS_DEVELOPMENT_ENVIRONMENT) {
      const logFormat = 'dev';
      app.use(morgan(logFormat));
    }
  },

  prettifyJsonOutput(app) {
    app.set('json spaces', 2);
  },
};

module.exports = configureWebserver;
