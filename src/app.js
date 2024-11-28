import { serve } from "bun";
import system from "./controls/system.js";
import Addons from "./controls/addons.js";
import Database from "./controls/database.js";
import ResponseHandler from "./handler/res/resHandler.js";

class App {
  constructor() {
    this.addon = new Addons();
    this.db = new Database();
  }

  /**
   * @typedef {Object} request
   */

  /**
   * @typedef {ResponseHandler} response

  //>> MIDDLEWARE
  /**
   * @description
   * Middleware functions run sequentially, and the chain **halts if a response is sent**.
   *
   * @param {(req: request, res: response) => void} func - supports two parameters: `req`, `res`.
   */
  middleware(func) {
    system.middleware(func);
  }

  //>> REQUEST METHODS

  /**
   * Adds a route handler for the specified HTTP method and path.
   *
   * @param {string} method - The HTTP method to match - GET, POST, etc.
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_route(method, path, handler) {
    system.req_route(method, path, handler);
  }

  /**
   * Adds a GET route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_get(path, handler) {
    system.req_get(path, handler);
  }

  /**
   * Adds a POST route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_post(path, handler) {
    system.req_post(path, handler);
  }

  /**
   * Adds a PUT route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_put(path, handler) {
    system.req_put(path, handler);
  }

  /**
   * Adds a DELETE route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_delete(path, handler) {
    system.req_delete(path, handler);
  }

  /**
   * Adds a PATCH route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_patch(path, handler) {
    system.req_patch(path, handler);
  }

  /**
   * Adds a HEAD route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_head(path, handler) {
    system.req_head(path, handler);
  }

  /**
   * Adds a OPTIONS route handler for the specified path.
   *
   * @param {string} path - The path to match.
   * @param {(req: request, res: response, params: { [key: string]: string }) => any} handler - The route handler function that takes
   * three parameters: `req`, `res`, and `options`.
   */
  req_options(path, handler) {
    system.req_options(path, handler);
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

        // TODO : ADD WEBSOCKET SUPPORT
        websocket: {
          open: (ws) => {
            // console.log("Client connected");
          },
          message: (ws, message) => {
            // console.log("Client sent message", message);
          },
          close: (ws) => {
            // console.log("Client disconnected");
          },
        },
      });
    } catch (err) {
      system.error("app", "starting server failed", err);
    }
  }
}

export default App;
