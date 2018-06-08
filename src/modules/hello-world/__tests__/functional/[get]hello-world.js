const {
  API,
  closeWebserver,
  startWebserver,
} = require('../../../../helpers/functional-tests.helper');

beforeAll(() => {
  return startWebserver();
});

afterAll(() => {
  return closeWebserver();
});

describe('[GET] /hello-world', () => {
  describe('it must return on its "body"', () => {
    let body = null;

    beforeEach(async () => {
      const response = await API.get('/hello-world');
      body = response.data;
    });

    it('"message" string property', () => {
      expect(body).toHaveProperty('message');
      expect(body).toEqual({ message: 'Hello world' });
    });
  });
});
