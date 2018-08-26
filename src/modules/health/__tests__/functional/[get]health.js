const axiosApiDocGenerator = require('axios-api-doc-generator');
const {
  API: { withoutAuthentication: API },
  closeWebserver,
  startWebserver,
} = require('../../../../helpers/functional-tests-helper');

beforeAll(() => startWebserver());

afterAll(async () => {
  await axiosApiDocGenerator.createApiDocsForTests();
  return closeWebserver();
});

const ENDPOINT = `/api/health`;
describe(`[GET] ${ENDPOINT}`, () => {
  it('(200) must return a { status: "OK" }', async () => {
    const response = await API.get(ENDPOINT);
    body = response.data;

    expect(body).toEqual({ status: 'OK' });
  });
});
