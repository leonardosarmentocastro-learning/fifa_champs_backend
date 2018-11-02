const axiosApiDocGenerator = require('axios-api-doc-generator');
const { DateTime } = require('luxon');

const {
  API: { withoutAuthentication: API },
  closeWebserver,
  startWebserver,
} = require('../../../../helpers/functional-tests-helper');
const { generalTestsHelper } = require('../../../../helpers');
const { usersValidator } = require('../../');

beforeAll(() => startWebserver());

afterAll(async () => {
  await axiosApiDocGenerator.createApiDocsForTests();
  return closeWebserver();
});

const ENDPOINT = '/api/users/constraints';
describe(`[GET] ${ENDPOINT}`, () => {
  beforeEach(() => {
    const year = 2018, month = 0, day = 1;
    generalTestsHelper.freezeTime(year, month, day);
  });

  it('(200) returns a payload', async () => {
    const response = await API.get(ENDPOINT);
    const { data: body } = response;

    // body
    const { constraints } = usersValidator;
    constraints.expirationDate = DateTime.local().plus({ hours: 32 }).toISO();
    expect(body).toEqual(constraints);
  });
});
