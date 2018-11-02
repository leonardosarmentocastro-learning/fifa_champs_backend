
const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const { database } = require('../../../../database');
const { sharedSchema, SHARED_CONSTANTS } = require('../../');
const { generalTestsHelper } = require('../../../../helpers');

describe('[functional-test] sharedSchema', () => {
  let sharedModel = null;
  const specs = {
    year: 2018,
    month: 1,
    day: 1,
  };

  beforeAll(async () => {
    await database.connect();

    // The "sharedSchema" has no model, it is appended to existing models.
    // But to test it's middlewares, we need to pretend it is part of an "model".
    const name = 'Shared';
    sharedModel = mongoose.model(name, sharedSchema);

    generalTestsHelper.freezeTime(specs.year, specs.month, specs.day);
  });

  describe('[middleware] pre.save', () => {
    it('must set new values for "updatedAt" each time a model is save/updated', async () => {
      const sharedDocument = new sharedModel({});
      const databaseShared = await sharedDocument.save();

      expect(databaseShared.updatedAt.formattedDate)
        .toBe(
          DateTime.fromObject({ ...specs }).toFormat(SHARED_CONSTANTS.DATE_FORMAT.COMPLETE)
        );
      expect(databaseShared.updatedAt.isoDate)
        .toBe(
          DateTime.local().toISO()
        );

      const date = { year: 2020, month: 12, day: 1 };
      generalTestsHelper.freezeTime(date.year, date.month, date.day);
      const updatedShared = await databaseShared.save();

      expect(updatedShared.updatedAt.formattedDate)
        .toBe(
          DateTime.fromObject({ ...date }).toFormat(SHARED_CONSTANTS.DATE_FORMAT.COMPLETE)
        );
      expect(updatedShared.updatedAt.isoDate)
        .toBe(
          DateTime.local().toISO()
        );
    });
  });
});
