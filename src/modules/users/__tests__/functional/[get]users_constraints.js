const axiosApiDocGenerator = require('axios-api-doc-generator');
const { DateTime, Settings } = require('luxon');

const {
  API: { withoutAuthentication: API },
  closeWebserver,
  startWebserver,
} = require('../../../../helpers/functional-tests-helper');
const { usersValidator } = require('../../');

beforeAll(() => startWebserver());

afterAll(async () => {
  await axiosApiDocGenerator.createApiDocsForTests();
  return closeWebserver();
});

const ENDPOINT = '/api/users/constraints';
describe(`[GET] ${ENDPOINT}`, () => {
  beforeEach(() => {
    // Freeze the time to always return "1st of January 2018" whenever "DateTime.local()" is called.
    Settings.now = () => new Date(2018, 1, 1).valueOf();
  });

  it('(200) returns a payload', async () => {
    const response = await API.get(ENDPOINT);
    const { data: body } = response;

    // body
    const { constraints } = usersValidator;
    constraints.password.regex = constraints.password.regex.toString();
    constraints.expirationDate = DateTime.local().plus({ hours: 32 }).toISO();
    expect(body).toEqual(constraints);
  });
});
