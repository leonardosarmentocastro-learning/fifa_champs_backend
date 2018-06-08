const chalk = require('chalk');
const mongoose = require('mongoose');

const { APP_CONFIG } = require('../internals/configs');

const database = {
  async connect() {
    const { mongodb } = APP_CONFIG;

    try {
      const connection = await mongoose.connect(mongodb.uri);
      return connection;
    } catch (err) {
      const connectionErrorMessage = this.getConnectionErrorMessage(err);
      return Promise.reject(connectionErrorMessage);
    }
  },

  getConnectionErrorMessage(err) {
    const { mongodb } = APP_CONFIG;

    const stacktrace = chalk.grey(`
      #####################
      ###  Stacktrace   ###
      #####################

      ${err}
    `).trim();

    const suggestedTip = chalk.magenta(`
      #####################
      ### Suggested tip ###
      #####################

      Did you forget to run the "MongoDB" server?
      Do it by running:
      ${chalk.white('"mongod &"')} ${chalk.italic('(without quotation marks).')}
    `).trim();

    const connectionErrorMessage = chalk.red(`
      ########################################
      ### Error on database initialization ###
      ########################################

      Failed to connect MongoDB server located on the following URI:
      ${chalk.yellow(mongodb.uri)}

      -----
      ${suggestedTip}

      -----
      ${stacktrace}
    `).trim();

    return connectionErrorMessage;
  },
};

module.exports = database;
