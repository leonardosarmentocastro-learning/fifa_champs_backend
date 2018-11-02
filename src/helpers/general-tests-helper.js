const { Settings } = require('luxon');

const { configureShared } = require('../modules/shared');

const generalTestsHelper = {
  freezeTime(year, month, day) {
    configureShared.datetimeLibrarySettings();

    // NOTE:
    // Native "Date" expects a range of month values from 0-11.
    // Luxon library expects range of month values from 1-12.
    // Inside tests we set values compatible with "Luxon" and here with native "Date".
    Settings.now = () => new Date(year, (month - 1), day).valueOf();
  },
};

module.exports = generalTestsHelper;
