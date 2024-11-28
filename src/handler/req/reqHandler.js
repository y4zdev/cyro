import system from "../../controls/system.js";

/**
 * @typedef {Object} Middleware
 * @property {function} applyMiddlewares - Adds a middleware function to the middleware chain
 */

/**
 * @typedef {Object} Request
 * @property {string} method - The HTTP method of the request
 * @property {string} url - The URL of the request
 */

/**
 * @typedef {Object} Route
 * @property {RegExp} regex - The regular expression to match the route
 * @property {string[]} keys - The dynamic keys for route parameters
 * @property {function} handler - The function to handle the route
 */

/**
 * @typedef {Object} Routes
 * @property {Record<string, Route[]>} routes - The routes object, where the key is the HTTP method
 */

/**
 * @description
 * Request handler for handling each incoming request
 * @param {Request} req - The request object
 * @param {Routes} routes - The routes object
 * @param {Middleware} middleware - The middleware object
 * @returns {Promise<void|Response>} Resolves when the request is handled.
 */
const RequestHandler = async (req, routes, middleware) => {
  const res = system.res;

  try {
    // Apply middlewares with both req and res
    const responseFromMiddleware = await middleware.applyMiddlewares(req, res);

    if (responseFromMiddleware && res.finishState()) {
      return res.end();
    }

    // Extract request details
    const method = req.method || "GET"; // Default to GET if method is undefined
    let url;
    try {
      url = new URL(req.url);
    } catch (urlError) {
      system.error("request", "Invalid URL in request", urlError);
      res.send("Bad Request", 400);
      return;
    }

    const pathname = url.pathname;
    const queryParams = Object.fromEntries(url.searchParams.entries());

    // Validate routes object
    if (!routes || !routes.routes || typeof routes.routes !== "object") {
      throw new Error("Invalid or missing routes configuration");
    }

    if (typeof routes.routes[method] !== "object") {
      throw new Error(`No routes defined for HTTP method: ${method}`);
    }

    // Find matching route
    const route = routes.routes[method]?.find((r) => r.regex.test(pathname));
    if (!route) {
      res.send("Not Found", 404);
      return;
    }

    const match = pathname.match(route.regex);
    if (!match) {
      res.send("Not Found", 404);
      return;
    }

    const dynamicparams = /** @type {{ [key: string]: string }} */ ({});

    try {
      route.keys.forEach((key, index) => {
        dynamicparams[key] = match[index + 1];
      });
    } catch (error) {
      system.error("request", "extracting dynamic parameters", error);
      return res.send("Internal Server Error", 500);
    }

    // Create an options object to pass to the handler
    const option = {
      dynamic: dynamicparams,
      query: queryParams,
    };

    // Call the route handler
    try {
      await route.handler(req, res, option);
    } catch (error) {
      system.error("request", "in route handler", error);
      return res.send("Internal Server Error", 500);
    }

    // End the response
    res.end();
    return;
  } catch (err) {
    system.error("request", "in request handler", err);
    return res.send("Internal Server Error", 500);
  }
};

export default RequestHandler;
