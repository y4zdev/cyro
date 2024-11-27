import system from "../../controls/system.js";

class ResponseHandler {
  constructor() {
    this.statusCode = 200;
    this.headers = new Headers();
    this.body = null;
    this.finished = false; // Track if the response has been sent
  }

  /**
   * Sets the HTTP status code for the response.
   * @param {number} code - The HTTP status code to set.
   */
  status(code) {
    if (typeof code === "number" && code >= 100 && code <= 599) {
      this.statusCode = code;
    } else {
      system.error("response", `Invalid status code - ${code}`);
      this.statusCode = 500;
    }
  }

  /**
   * Adds or updates headers in the response.
   * @param {string|Object} nameOrHeaders - Header name as a string or an object with multiple headers.
   * @param {string} [value] - The value for the header if the first argument is a string.
   */
  header(nameOrHeaders, value) {
    if (typeof nameOrHeaders === "object") {
      Object.entries(nameOrHeaders).forEach(([key, val]) =>
        this.headers.set(key, val)
      );
    } else if (typeof nameOrHeaders === "string" && value !== undefined) {
      this.headers.set(nameOrHeaders, value);
    } else {
      system.error(
        "response",
        `Invalid headers provided - ${nameOrHeaders}, ${value}`
      );
    }
  }

  /**
   * Sends a response with the specified body, status, and headers.
   * @param {any} body - Response body (string, object, buffer, or stream).
   * @param {number} [status=200] - HTTP status code.
   * @param {Object} [headers={}] - Additional headers.
   */
  send(body, status = 200, headers = {}) {
    try {
      this.status(status);
      this.header(headers);

      this.setContentType(body);
      this.body = this.formatBody(body);

      return this.end();
    } catch (err) {
      system.error("response", "send method", err);
      return this.internalServerError();
    }
  }

  /**
   * Sends a JSON response.
   * @param {any} data - JSON data to send.
   * @param {number} [status=200] - HTTP status code.
   * @param {Object} [headers={}] - Additional headers.
   */
  json(data, status = 200, headers = {}) {
    try {
      this.header("Content-Type", "application/json");
      return this.send(JSON.stringify(data), status, headers);
    } catch (err) {
      system.error("response", "json method", err);
      return this.internalServerError();
    }
  }

  /**
   * Sends a text response.
   * @param {string} text - Text response body.
   * @param {number} [status=200] - HTTP status code.
   * @param {Object} [headers={}] - Additional headers.
   */
  text(text, status = 200, headers = {}) {
    try {
      this.header("Content-Type", "text/plain");
      return this.send(text, status, headers);
    } catch (err) {
      system.error("response", "text method", err);
      return this.internalServerError();
    }
  }

  /**
   * Sends an HTML response.
   * @param {string} htmlContent - HTML content.
   * @param {number} [status=200] - HTTP status code.
   * @param {Object} [headers={}] - Additional headers.
   */
  html(htmlContent, status = 200, headers = {}) {
    try {
      this.header("Content-Type", "text/html");
      return this.send(htmlContent, status, headers);
    } catch (err) {
      system.error("response", "html method", err);
      return this.internalServerError();
    }
  }

  /**
   * Redirects to the specified URL.
   * @param {string} url - The URL to redirect to.
   * @param {number} [status=302] - Redirect status code.
   */
  redirect(url, status = 302) {
    try {
      this.status(status);
      this.header("Location", url);
      this.body = null; // No body for redirect
      return this.end();
    } catch (err) {
      system.error("response", "redirect method", err);
      return this.internalServerError();
    }
  }

  /**
   * Ends the response and returns a Response object.
   * @returns {Response} - The Response object.
   */
  end() {
    this.finished = true;
    try {
      return new Response(this.body, {
        status: this.statusCode,
        headers: this.headers,
      });
    } catch (err) {
      system.error("response", "end method", err);
      return this.internalServerError();
    }
  }

  /**
   * @typedef {Object} CookieOptions
   * @property {Date} [expires] - Expiration date of the cookie.
   * @property {number} [maxAge] - Max age of the cookie in seconds.
   * @property {string} [path] - URL path for the cookie.
   * @property {string} [domain] - Domain for the cookie.
   * @property {boolean} [secure] - Whether the cookie is secure.
   * @property {boolean} [httpOnly] - Whether the cookie is HTTP-only.
   * @property {"Strict" | "Lax" | "None"} [sameSite] - SameSite policy for the cookie.
   */

  /**
   * Sets a cookie.
   * @param {string} name - Cookie name.
   * @param {string} value - Cookie value.
   * @param {CookieOptions} [options={}] - Additional cookie options.
   */
  cookie(name, value, options = {}) {
    try {
      const cookieParts = [
        `${name}=${encodeURIComponent(value)}`,
        options.expires ? `Expires=${options.expires.toUTCString()}` : null,
        options.maxAge ? `Max-Age=${options.maxAge}` : null,
        options.path ? `Path=${options.path}` : null,
        options.domain ? `Domain=${options.domain}` : null,
        options.secure ? "Secure" : null,
        options.httpOnly ? "HttpOnly" : null,
        options.sameSite ? `SameSite=${options.sameSite}` : null,
      ].filter(Boolean);

      this.header("Set-Cookie", cookieParts.join("; "));
    } catch (err) {
      system.error("response", "cookie method", err);
    }
  }

  /**
   * Sets appropriate content type based on the body.
   * @param {any} body - Response body.
   */
  setContentType(body) {
    if (typeof body === "string") {
      const isHTML = body.trim().startsWith("<") && body.trim().endsWith(">");
      this.header("Content-Type", isHTML ? "text/html" : "text/plain");
    } else if (typeof body === "object" && !(body instanceof ArrayBuffer)) {
      this.header("Content-Type", "application/json");
    } else if (body instanceof ArrayBuffer) {
      this.header("Content-Type", "application/octet-stream");
    }
  }

  /**
   * Formats the response body for supported types.
   * @param {any} body - Response body.
   */
  formatBody(body) {
    if (typeof body === "object" && !(body instanceof ArrayBuffer)) {
      return JSON.stringify(body);
    }
    return body;
  }

  /**
   * Returns a 500 Internal Server Error response.
   */
  internalServerError() {
    this.status(500);
    this.body = "Internal Server Error";
    return this.end();
  }
}

export default ResponseHandler;
