import system from "../../controls/system.js";
import ResponseHandler from "../res/resHandler.js";

/**
 * @typedef {Object} Request
 * @property {string} method - HTTP method of the request.
 * @property {string} url - Request URL.
 * @property {object} headers - Request headers.
 * @property {any} body - Request body.
 */

/**
 * @callback RouteHandler
 * @param {Request} req - Request object.
 * @param {ResponseHandler} res - Response handler object.
 * @param {{ [key: string]: string }} params - Route parameters.
 */

class RoutesHandler {
  constructor() {
    /**
     * @type {{ [method: string]: { regex: RegExp, keys: string[], handler: RouteHandler }[] }}
     */
    this.routes = {
      GET: [],
      POST: [],
      PUT: [],
      DELETE: [],
      PATCH: [],
      HEAD: [],
      OPTIONS: [],
    };

    /**
     * @type {string[]}
     */
    this.supportedMethods = Object.keys(this.routes); // Dynamically infer supported methods
  }

  /**
   * Adds a route handler for the specified HTTP method and path.
   *
   * @param {string} method - HTTP method (GET, POST, etc.).
   * @param {string} path - Route path, can contain parameters like `:param`.
   * @param {RouteHandler} handler - Function to handle the route.
   */
  route(method, path, handler) {
    try {
      // Validate HTTP method
      method = method.toUpperCase();
      if (!this.supportedMethods.includes(method)) {
        throw new Error(`Unsupported HTTP method: ${method}`);
      }

      // Validate path and handler
      if (typeof path !== "string" || !path.startsWith("/")) {
        throw new Error(
          `Invalid path: "${path}". Paths must be strings starting with "/"`
        );
      }
      if (typeof handler !== "function") {
        throw new Error("Handler must be a function.");
      }

      // Convert path to regex and extract keys
      const { regex, keys } = this._convertPathToRegex(path);

      // Add route to the routes table
      this.routes[method].push({ regex, keys, handler });
    } catch (error) {
      system.error("routes", `Failed to add route [${method} ${path}]`, error);
    }
  }

  /**
   * Handles a request by finding and executing the appropriate route handler.
   *
   * @param {string} method - HTTP method of the request.
   * @param {string} path - Path of the request.
   * @param {Request} req - Request object.
   * @param {ResponseHandler} res - ResponseHandler instance.
   */
  handleRequest(method, path, req, res) {
    try {
      method = method.toUpperCase();
      if (!this.supportedMethods.includes(method)) {
        throw new Error(`Unsupported HTTP method: ${method}`);
      }

      // Find matching route
      const route = this._matchRoute(method, path);
      if (!route) {
        res.send("Route not found", 404);
        return;
      }

      // Extract parameters and call handler
      const params = this._extractParams(route.keys, route.regex, path);
      route.handler(req, res, params);
    } catch (error) {
      system.error(
        "routes",
        `Error handling request [${method} ${path}]`,
        error
      );
      res.send("Internal Server Error", 500);
    }
  }

  /**
   * Adds a GET route handler.
   * @param {string} path - Path for the GET request.
   * @param {RouteHandler} handler - Route handler function.
   */
  get(path, handler) {
    this.route("GET", path, handler);
  }

  /**
   * Adds a POST route handler.
   * @param {string} path - Path for the POST request.
   * @param {RouteHandler} handler - Route handler function.
   */
  post(path, handler) {
    this.route("POST", path, handler);
  }

  /**
   * Adds a PUT route handler.
   * @param {string} path - Path for the PUT request.
   * @param {RouteHandler} handler - Route handler function.
   */
  put(path, handler) {
    this.route("PUT", path, handler);
  }

  /**
   * Adds a DELETE route handler.
   * @param {string} path - Path for the DELETE request.
   * @param {RouteHandler} handler - Route handler function.
   */
  delete(path, handler) {
    this.route("DELETE", path, handler);
  }

  /**
   * Adds a PATCH route handler.
   * @param {string} path - Path for the PATCH request.
   * @param {RouteHandler} handler - Route handler function.
   */
  patch(path, handler) {
    this.route("PATCH", path, handler);
  }

  /**
   * Adds a HEAD route handler.
   * @param {string} path - Path for the HEAD request.
   * @param {RouteHandler} handler - Route handler function.
   */
  head(path, handler) {
    this.route("HEAD", path, handler);
  }

  /**
   * Adds an OPTIONS route handler.
   * @param {string} path - Path for the OPTIONS request.
   * @param {RouteHandler} handler - Route handler function.
   */
  options(path, handler) {
    this.route("OPTIONS", path, handler);
  }

  /**
   * Converts a path with parameters (e.g., `/user/:id`) into a regex.
   *
   * @param {string} path - The path string.
   * @returns {{ regex: RegExp, keys: string[] }}
   */
  _convertPathToRegex(path) {
    /** @type {string[]} keys */
    const keys = [];
    const regexString = path
      .replace(/:([^\/]+)/g, (_, key) => {
        keys.push(key);
        return "([^\\/]+)";
      })
      .replace(/\*/g, ".*"); // Support wildcard paths
    const regex = new RegExp(`^${regexString}$`);
    return { regex, keys };
  }

  /**
   * Matches a route by method and path.
   *
   * @param {string} method - HTTP method.
   * @param {string} path - Request path.
   * @returns {{ regex: RegExp, keys: string[], handler: RouteHandler } | null} The matching route or null.
   */
  _matchRoute(method, path) {
    return this.routes[method].find((route) => route.regex.test(path)) || null;
  }

  /**
   * Extracts URL parameters from a matched route.
   *
   * @param {string[]} keys - Array of parameter keys.
   * @param {RegExp} regex - Path regex.
   * @param {string} path - Request path.
   * @returns {{ [key: string]: string }} Object containing extracted parameters.
   */
  _extractParams(keys, regex, path) {
    const values = path.match(regex)?.slice(1) || [];
    return keys.reduce((params, key, index) => {
      params[key] = values[index];
      return params;
    }, /** @type {{ [key: string]: string }} */ ({}));
  }
}

export default RoutesHandler;
