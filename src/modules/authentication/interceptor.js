const { authenticationValidator } = require('../../modules/authentication');

const authenticationInterceptor = {
  // Dependency injection
  get authenticationValidator() { return { ...authenticationValidator }; },

  connect(app) {
    // We bind "this" because otherwise it will refer to "express.js" context.
    app.use(this.middleware.bind(this));
  },

  middleware(req, res, next) {
    const authorize = next;
    const unauthorize = (error, res) => res.status(401).json(error);

    const error = this.authenticationValidator.validateForMiddlewareAuthorization(req);
    if (error) return unauthorize(error, res);

    return authorize();
  },
};

module.exports = authenticationInterceptor;
