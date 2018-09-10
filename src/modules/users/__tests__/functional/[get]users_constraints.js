const axiosApiDocGenerator = require('axios-api-doc-generator');

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
  it('(200) returns a payload', async () => {
    const response = await API.get(ENDPOINT);
    const { data: body } = response;

    // body
    const { constraints } = usersValidator;
    constraints.password.regex = constraints.password.regex.toString();
    expect(body).toEqual(constraints);
  });
});
