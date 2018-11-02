const { sharedSchema } = require('../../../shared');
const usersSchema = require('../../schema');

describe('[unit-test] usersSchema', () => {
  it('must inherit the "sharedSchema" properties', () => {
    expect(usersSchema.tree)
      .toEqual(
        expect.objectContaining(sharedSchema.tree)
      );
  });
});
