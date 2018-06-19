const { Settings } = require('luxon');

const configureShared = {
  datetimeLibrarySettings() {
    Settings.defaultLocale = 'pt-br'; // Brazilian portuguese.
  },
};

module.exports = configureShared;
