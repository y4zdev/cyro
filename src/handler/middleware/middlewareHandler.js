import system from "../../controls/system.js";
import ResponseHandler from "../res/resHandler.js";

class MiddlewareHandler {
  constructor() {
    /** @type {Array<function>} */
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
    if (typeof middleware !== "function") {
      throw new Error("Middleware must be a function");
    }
    this.middlewares.push(middleware);
  }

  /**
   * @typedef {Object} Request
   * @property {boolean} [finished] - Indicates if the request has been handled and the response is complete.
   */

  /**
   * Applies the middleware chain to the request and response objects.
   *
   * @param {Request} req - The request object.
   * @param {ResponseHandler} res - The response object.
   * @returns {Promise<ResponseHandler|null|undefined>} Resolves to the response object if a middleware finishes it,
   * or null if no middleware ends the response.
   */
  async applyMiddlewares(req, res) {
    try {
      for (const middleware of this.middlewares) {
        try {
          await middleware(req, res);
          if (res.finishState()) {
            return res;
          }
        } catch (error) {
          system.error("MIDDLEWARE", "Error in middleware", error);
          if (typeof res.send === "function") {
            res.send("Internal Server Error", 500);
          }
          return res;
        }
      }
      return null; // Return null only if no middleware ends the response
    } catch (error) {
      system.error("MIDDLEWARE", "Unexpected error in applyMiddlewares", error);
    }
  }
}

export default MiddlewareHandler;
