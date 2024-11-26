import system from "../../controls/system.js";

/**
 * @description
 * Request handler for handling each incoming request
 * @param {Object} req - The request object
 * @param {Object} routes - The routes object
 * @param {Object} middleware - The middleware object
 * @returns {Promise}
 */
const RequestHandler = async (req, routes, middleware) => {
  const res = system.res();

  try {
    // Apply middlewares with both req and res
    const responseFromMiddleware = await middleware.applyMiddlewares(req, res);
    if (responseFromMiddleware && res.finished) {
      return res.end(); // Return the Response object created by res.end()
    }

    // Extract request details
    const method = req.method || "GET"; // Default to GET if method is undefined
    let url;
    try {
      url = new URL(req.url);
    } catch (urlError) {
      system.error("request", "Invalid URL in request", urlError);
      return res.send("Bad Request", 400);
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
    if (route) {
      const match = pathname.match(route.regex);
      const dynamicparams = {};

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
      return res.end();
    } else {
      // console.warn(`![REQUEST]: Route not found for ${method} ${pathname}`);
      return res.send("Not Found", 404);
    }
  } catch (err) {
    system.error("request", "in request handler", err);
    return res.send("Internal Server Error", 500);
  }
};

export default RequestHandler;
