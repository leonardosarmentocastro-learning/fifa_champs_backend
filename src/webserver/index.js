const chalk = require('chalk');
const express = require('express');
const http = require('http');

const { APP_CONFIG } = require('../internals/configs');
const configure = require('./configure');
const database = require('../database');
const router = require('./router');

class Webserver {
  constructor() {
    this.app = null;
    this.database = database;
    this.router = router;
    this.server = null;
  }

  close() {
    const isServerRunning = this.server.listening;
    if (!isServerRunning) {
      return;
    }

    this.server.close(() => {
      const message = chalk.green(`
        ######################################
        ###   Server closed successfully!  ###
        ######################################
      `);

      console.info(message); // eslint-disable-line
    });
  }

  connectRoutes(app) {
    this.router.connect(app);
  }

  getServerSuccessfullyStartedMessage(options) {
    const { port, environment } = options;

    const message = chalk.green(`
      ######################################
      ### Server successfully started!  ###
      ######################################

      Server listening
      on port ${chalk.yellow(port)}
      in ${chalk.yellow(environment)} mode.
    `);
    return message;
  }

  getErrorOnStartingServerMessage(err, options) {
    const { environment, port } = options;

    const stacktrace = chalk.grey(`
      #####################
      ###  Stacktrace   ###
      #####################

      ${err}
    `);

    const message = chalk.red(`
      ######################################
      ### Error on starting the server   ###
      ######################################

      Failed to start the server
      on port ${chalk.yellow(port)},
      in ${chalk.yellow(environment)} mode.

      -----

      ${stacktrace}
    `);

    return message;
  }

  setExpressMiddlewares(app) {
    configure.bodyParser(app);
    configure.prettifyJsonOutput(app);
    configure.requestCompression(app);
    configure.logErrorsOnConsoleDependingOnEnviroment(app);
    configure.logRequestsOnConsoleDependingOnEnvironment(app);
    configure.corsWithAuthorizationHeaderEnabled(app);
  }

  async start() {
    // Run the database
    await this.database.connect();

    // Run the server
    this.app = express();
    this.server = http.createServer(this.app);
    this.setExpressMiddlewares(this.app);
    this.connectRoutes(this.app);

    return this.listen();
  }

  async listen() {
    const {
      environment,
      ip,
      port,
    } = APP_CONFIG;

    return new Promise((resolve, reject) => {
      const callback = {
        whenServerStartSuccessfully: () => {
          const options = { port, environment };
          const message = this.getServerSuccessfullyStartedMessage(options);

          return resolve(console.info(message)); // eslint-disable-line
        },

        whenServerFailedToStart: (err) => {
          const options = { port, environment };
          const message = this.getErrorOnStartingServerMessage(err, options);

          return reject(message);
        },
      };

      // Start listening to connections.
      // Stores the "server" instance so we can close it manually if we wish to.
      const backlog = 511; // Maximum length of the queue of pending connections.
      this.server =
        this.app.listen(port, ip, backlog, callback.whenServerStartSuccessfully);

      // If the server failed to start, a callback will be fired to tell us that.
      this.server.on('error', callback.whenServerFailedToStart);
    });
  }
}

module.exports = Webserver;
