require('dotenv').config(); // Reads the ".env" file at the root of the project.
const getenv = require('getenv');

// ENVIRONMENT VARIABLES
// Fallback values.
const DEFAULT = {
  environment: 'development',
  giphy: {
    apiKey: 'default-giphy-apikey',
    host: 'api.giphy.com',
  },
  ip: '127.0.0.1',
  port: 8080,
};

// # E
const environment = getenv.string('ENVIRONMENT', DEFAULT.environment);

// # G
const giphy = {
  apiKey: getenv.string('GIPHY_API_KEY', DEFAULT.giphy.apiKey),
  host: getenv.string('GIPHY_HOST', DEFAULT.giphy.host),
};

// # I
const ip = getenv.string('IP', DEFAULT.ip);

// # P
const port = getenv.string('PORT', DEFAULT.port);

// CONSTANTS
const IS_DEVELOPMENT_ENVIRONMENT = (environment === 'development');
const IS_TEST_ENVIRONMENT = (environment === 'test');

const APP_CONFIG = {
  environment,
  giphy,
  ip,
  IS_DEVELOPMENT_ENVIRONMENT,
  IS_TEST_ENVIRONMENT,
  port,
};
module.exports = APP_CONFIG;
