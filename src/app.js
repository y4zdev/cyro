import { serve } from "bun";
import system from "./controls/system.js";
import Addons from "./controls/addons.js";
import Database from "./controls/database.js";

class App {
  constructor() {
    this.addon = new Addons();
    this.db = new Database();
  }

  //>> REQUEST METHODS

  /**
   * @typedef {Object} reqType
   */

  /**
   * @typedef {Object} resType
   * @property {function(number): resType} status - Sets the response status code and returns the response handler.
   * @property {number} statusCode - The HTTP status code.
   * @property {Object} headers - The headers of the response.
   * @property {string} body - The body of the response.
   * @property {boolean} finished - Whether the response is finished.
   * @property {Function} setHeader - Function to set a header in the response.
   * @property {Function} send - Function to send the response body.
   * @property {Function} end - Function to end the response.
   * @property {Function} header - Sets a header for the response.
   * @property {Function} json - Sends a JSON response.
   * @property {Function} text - Sends a plain text response.
   * @property {Function} html - Sends an HTML response.
   */

  /**
   * Adds a route handler for the specified HTTP method and path.
   *
   * @param {string} method - The HTTP method to match - GET, POST, etc.
   * @param {string} path - The path to match.
   * @param {(req: reqType, res: resType, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_route(method, path, handler) {
    system.req_route(method, path, handler);
  }

  /**
   * Adds a GET route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: reqType, res: resType, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_get(path, handler) {
    system.req_get(path, handler);
  }

  /**
   * Adds a POST route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: reqType, res: resType, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_post(path, handler) {
    system.req_post(path, handler);
  }

  /**
   * Adds a PUT route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: reqType, res: resType, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_put(path, handler) {
    system.req_put(path, handler);
  }

  /**
   * Adds a DELETE route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: reqType, res: resType, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_delete(path, handler) {
    system.req_delete(path, handler);
  }

  /**
   * Adds a PATCH route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: reqType, res: resType, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_patch(path, handler) {
    system.req_patch(path, handler);
  }

  /**
   * Adds a HEAD route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: reqType, res: resType, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_head(path, handler) {
    system.req_head(path, handler);
  }

  /**
   * Adds a OPTIONS route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: reqType, res: resType, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_options(path, handler) {
    system.req_options(path, handler);
  }

  //>> MIDDLEWARE
  /**
   * Adds a middleware function to the middleware chain.
   *
   * @param {function} func - The middleware function that takes
   */
  middleware(func) {
    system.middleware(func);
  }

  //>> SYSTEM EVENTS

  /**
   * Runs the server on the specified port.
   * @param {number} port - The port to listen on. Defaults to 2772.
   * @returns {void}
   */
  run(port = 2772) {
    try {
      serve({
        fetch: (req) => system.req(req),
        port: port,

        // @ts-ignore: Ignore websocket property error for now
        // TODO : ADD WEBSOCKET SUPPORT
        websocket: false,
      });
    } catch (err) {
      system.error("app", "starting server failed", err);
    }
  }
}

export default App;
