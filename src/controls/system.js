import ResponseHandler from "../handler/res/resHandler.js";
import Middleware from "../handler/middleware/middlewareHandler.js";
import Request from "../handler/req/reqHandler.js";
import Routes from "../handler/routes/routesHandler.js";
import Addons from "./addons.js";
import Database from "./database.js";
import errHandler from "../handler/error/errorHandler.js";

class System {
  constructor() {
    this.res = new ResponseHandler();
    this.middlewareChain = new Middleware();
    this.routes = new Routes();
    this.addon = new Addons();
    this.db = new Database();
  }

  //> REQUESTS
  /**
   * @typedef {Object} Request
   * @property {string} method - The HTTP method of the request
   * @property {string} url - The URL of the request
   */

  /**
   * Request handler
   *
   * @param {Request} req - The request object
   */
  req(req) {
    return Request(req, this.routes, this.middlewareChain);
  }

  //> REQUEST METHODS
  /**
   * @typedef {Object} request
   */
  /**
   * @typedef {ResponseHandler} response
   * @property {function(number): response} status - Sets the response status code and returns the response handler.

  /**
   * Adds a route handler for the specified HTTP method and path.
   *
   * @param {string} method - The HTTP method to match (GET, POST, etc.)
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_route(method, path, handler) {
    this.routes.route(method, path, handler);
  }

  /**
   * Adds a GET route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_get(path, handler) {
    this.routes.get(path, handler);
  }

  /**
   * Adds a POST route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_post(path, handler) {
    this.routes.post(path, handler);
  }

  /**
   * Adds a PUT route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_put(path, handler) {
    this.routes.put(path, handler);
  }

  /**
   * Adds a DELETE route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_delete(path, handler) {
    this.routes.delete(path, handler);
  }

  /**
   * Adds a PATCH route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_patch(path, handler) {
    this.routes.patch(path, handler);
  }

  /**
   * Adds a HEAD route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_head(path, handler) {
    this.routes.head(path, handler);
  }

  /**
   * Adds a OPTIONS route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_options(path, handler) {
    this.routes.options(path, handler);
  }

  //> MIDDLEWARE
  /**
   * Adds a middleware function to the middleware chain.
   *
   * @param {function} func - The middleware function that takes
   */
  middleware(func) {
    return this.middlewareChain.use(func); //not use
  }

  //> ERRORS
  /**
   * Handles an error.
   *
   * @param {string} where - The location of the error.
   * @param {string} why - The reason for the error.
   * @param {unknown} [err] - The error object.
   */
  error(where, why, err) {
    errHandler.print(where, why, err);
  }
}

export default new System();
