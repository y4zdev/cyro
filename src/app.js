import { serve } from "bun";
import system from "./controls/system.js";
import Addons from "./controls/addons.js";
import Database from "./controls/database.js";

class App {
  constructor() {
    this.addon = new Addons();
    this.db = new Database();
  }

  //>> MIDDLEWARE

  /**
   * Adds a middleware function to the middleware chain.
   *
   * @param {function} func - The middleware function that takes
   */
  middleware(func) {
    system.middleware.use(func);
  }

  //>> REQUEST METHODS

  /**
   * Adds a GET route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_get(path, handler) {
    system.req_get(path, handler);
  }

  /**
   * Adds a POST route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_post(path, handler) {
    system.req_post(path, handler);
  }

  /**
   * Adds a PUT route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_put(path, handler) {
    system.req_put(path, handler);
  }

  /**
   * Adds a DELETE route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_delete(path, handler) {
    system.req_delete(path, handler);
  }

  /**
   * Adds a PATCH route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_patch(path, handler) {
    system.req_patch(path, handler);
  }

  /**
   * Adds a HEAD route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_head(path, handler) {
    system.req_head(path, handler);
  }

  /**
   * Adds a OPTIONS route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_options(path, handler) {
    system.req_options(path, handler);
  }

  /**
   * Adds a route handler for the specified HTTP method and path.
   *
   * @param {string} method - The HTTP method to match.
   * @param {string} path - The path to match. The path can contain parameter
   * placeholders like `:param`, and the handler function will be passed an object
   * with the parameter names as keys.
   * @param {function} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `params`. The `req` object
   * will contain the request data in its `body` property, which is a
   * `URLSearchParams` object. The `res` object is a `ResponseHandler`
   * instance, and the `params` object is an object containing any
   * URL parameters that were matched.
   */
  req_route(method, path, handler) {
    system.req_route(method, path, handler);
  }

  //>> MAIN EVENTS

  /**
   * Runs the server on the specified port.
   * @param {number} port - The port to listen on. Defaults to 2772.
   * @returns {void}
   */
  run(port = 2772) {
    const server = serve({
      port: port,
      fetch: (req) => system.req(req),
    });
  }
}

export default App;
