class MiddlewareHandler {
  constructor() {
    this.middlewares = [];
  }

  /**
   * Adds a middleware function to the middleware chain.
   *
   * @param {function} middleware - The middleware function to add. The middleware
   * function takes two parameters: `req`, `res`. The `req` object is
   * the request object, the `res` object is the response object. The
   * middleware function should return a promise or void.
   */
  use(middleware) {
    this.middlewares.push(middleware);
  }

  /**
   * Applies the middleware chain to the request and response objects.
   *
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Promise}
   */
  async applyMiddlewares(req, res) {
    try {
      for (const middleware of this.middlewares) {
        await middleware(req, res);
        if (res.finished) {
          return res; // Explicitly return the response if finished
        }
      }
      return null; // Return null only if no middleware ends the response
    } catch (err) {
      console.log(err);
    }
  }
}

export default MiddlewareHandler;
