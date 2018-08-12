const axiosApiDocGenerator = require('axios-api-doc-generator');
const {
  API,
  closeWebserver,
  startWebserver,
} = require('../../../../helpers/functional-tests-helper');

beforeAll(() => startWebserver());

afterAll(async () => {
  await axiosApiDocGenerator.createApiDocsForTests();
  return closeWebserver();
});

const ENDPOINT = `/api/hello-world`;
describe(`[GET] ${ENDPOINT}`, () => {
  describe('it must return on its "body"', () => {
    let body = null;

    beforeEach(async () => {
      const response = await API.get(ENDPOINT);
      body = response.data;
    });

    it('"message" string property', () => {
      expect(body).toHaveProperty('message');
      expect(body).toEqual({ message: 'Hello world' });
    });
  });
});
