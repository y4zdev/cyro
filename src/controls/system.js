import ResponseHandler from "../handler/res/resHandler.js";
import Middleware from "../handler/middleware/middlewareHandler.js";
import Request from "../handler/req/reqHandler.js";
import Routes from "../handler/routes/routesHandler.js";
import Addons from "./addons.js";
import Database from "../handler/database/database.js";

class System {
  constructor() {
    this.middleware = new Middleware();
    this.routes = new Routes();
    this.addon = new Addons();
    this.db = new Database();
  }

  //> REQUESTS
  /**
   * Request handler
   *
   * @param {Object} req - The request object
   */
  req(req) {
    return Request(req, this.routes, this.middleware);
  }

  //> ROUTES
  routes() {
    return this.routes; // not use
  }

  //> MIDDLEWARE
  middleware() {
    return this.middleware; //not use
  }

  //> RESPONSES

  res() {
    return new ResponseHandler();
  }

  //REQUEST METHODS

  /**
   * Adds a GET route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_get(path, handler) {
    this.routes.get(path, handler);
  }

  /**
   * Adds a POST route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_post(path, handler) {
    this.routes.post(path, handler);
  }

  /**
   * Adds a PUT route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_put(path, handler) {
    this.routes.put(path, handler);
  }

  /**
   * Adds a DELETE route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_delete(path, handler) {
    this.routes.delete(path, handler);
  }

  /**
   * Adds a PATCH route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_patch(path, handler) {
    this.routes.patch(path, handler);
  }

  /**
   * Adds a HEAD route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_head(path, handler) {
    this.routes.head(path, handler);
  }

  /**
   * Adds a OPTIONS route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_options(path, handler) {
    this.routes.options(path, handler);
  }

  /**
   * Adds a route handler for the specified HTTP method and path.
   *
   * @param {string} method - The HTTP method to match.
   * @param {string} path - The path to match.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_route(method, path, handler) {
    this.routes.route(method, path, handler);
  }
}

export default new System();
