const { Settings } = require('luxon');

const configureShared = {
  datetimeLibrarySettings() {
    Settings.defaultLocale = 'pt-br'; // Brazilian portuguese.
  },
  singletons() {
    this.datetimeLibrarySettings();
  },
};

module.exports = configureShared;
