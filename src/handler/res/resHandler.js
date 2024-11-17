class ResponseHandler {
  constructor() {
    this.statusCode = 200;
    this.headers = new Headers();
    this.body = null;
    this.finished = false; // Track if response has been sent
  }

  /**
   * Sets the status code for the response.
   *
   * @param {Number} code - The HTTP status code to set.
   */
  status(code) {
    this.statusCode = code;
  }

  /**
   * Sets headers using a given object or a single header using name and value.
   *
   * @param {string|Object} headersOrName - The header name to set or an object with headers.
   * @param {string} [value] - The header value to set (if headersOrName is a string).
   */
  header(headersOrName, value) {
    if (typeof headersOrName === "object") {
      for (const [key, val] of Object.entries(headersOrName)) {
        this.headers.set(key, val);
      }
    } else if (typeof headersOrName === "string" && value !== undefined) {
      this.headers.set(headersOrName, value);
    }
  }

  /**
   * Sends a response with the specified status code, headers and body.
   *
   * @param {any} body - The response body. Can be a string, an object, an array buffer, or a readable stream.
   * @param {Number} status - The HTTP status code to send. Defaults to 200.
   * @param {Object} headers - An object with header names as keys and their values as values.
   */
  send(body, status = 200, headers = {}) {
    this.statusCode = status;
    this.headers = new Headers(headers);
    this.finished = true; // Mark response as finalized

    if (
      typeof body === "object" &&
      !(body instanceof ReadableStream) &&
      !(body instanceof ArrayBuffer)
    ) {
      // If body is an object, assume JSON
      this.header("Content-Type", "application/json");
      this.body = JSON.stringify(body);
    } else if (typeof body === "string") {
      // If body is a string, assume text/plain unless HTML tags detected
      if (body.trim().startsWith("<") && body.trim().endsWith(">")) {
        this.header("Content-Type", "text/html");
      } else {
        this.header("Content-Type", "text/plain");
      }
      this.body = body;
    } else if (body instanceof ArrayBuffer || body instanceof Uint8Array) {
      // If body is binary data
      this.header("Content-Type", "application/octet-stream");
      this.body = body;
    } else if (body instanceof ReadableStream) {
      // If body is a stream, return a streaming response immediately
      return this.stream(body);
    } else {
      this.body = body; // If none of the above, send as-is
    }

    return this.end();
  }

  /**
   * Sends a JSON response with the specified data, status code, and headers.
   *
   * @param {any} data - The JSON data to send.
   * @param {Number} status - The HTTP status code to send. Defaults to 200.
   * @param {Object} headers - An object with additional headers to set.
   */
  json(data, status = 200, headers = {}) {
    this.header("Content-Type", "application/json");
    this.status(status); // Set the status
    this.body = JSON.stringify(data);
    this.header(headers); // Set additional headers
    return this.end();
  }

  /**
   * Sends a text response with the specified body, status code, and headers.
   *
   * @param {string} body - The text body to send.
   * @param {Number} status - The HTTP status code to send. Defaults to 200.
   * @param {Object} headers - An object with additional headers to set.
   */
  text(body, status = 200, headers = {}) {
    this.header("Content-Type", "text/plain");
    this.status(status); // Set the status
    this.body = body;
    this.header(headers); // Set additional headers
    return this.end();
  }

  /**
   * Sends an HTML response with the specified content, status code, and headers.
   *
   * @param {string} htmlContent - The HTML content to send.
   * @param {Number} status - The HTTP status code to send. Defaults to 200.
   * @param {Object} headers - An object with additional headers to set.
   * @returns {ResponseHandler} The ResponseHandler instance for chaining.
   */
  html(htmlContent, status = 200, headers = {}) {
    this.header("Content-Type", "text/html");
    this.status(status); // Set the status
    this.body = htmlContent;
    this.header(headers); // Set additional headers
    return this.end();
  }

  /**
   * Sends an XML response with the specified content, status code, and headers.
   *
   * @param {string} xmlContent - The XML content to send.
   * @param {Number} status - The HTTP status code to send. Defaults to 200.
   * @param {Object} headers - An object with additional headers to set.

   */
  xml(xmlContent, status = 200, headers = {}) {
    this.header("Content-Type", "application/xml");
    this.status(status); // Set the status
    this.body = xmlContent;
    this.header(headers); // Set additional headers
    return this.end();
  }

  /**
   * Sends a binary response with the specified data, status code, and headers.
   *
   * @param {ArrayBuffer|Buffer|Uint8Array} data - The binary data to send.
   * @param {Number} status - The HTTP status code to send. Defaults to 200.
   * @param {Object} headers - An object with additional headers to set.
   */
  binary(data, status = 200, headers = {}) {
    this.header("Content-Type", "application/octet-stream");
    this.status(status); // Set the status
    this.body = data;
    this.header(headers); // Set additional headers
    return this.end();
  }

  /**
   * Sends a file as the response. The file is sent as a binary response and
   * the filename is sent as a header, so that the browser can save the file
   * with the correct filename.
   *
   * @param {ArrayBuffer|Buffer|Uint8Array} fileData - The binary data of the file to send.
   * @param {string} [fileName="download"] - The filename to use when sending the file.
   * @param {Number} [status=200] - The HTTP status code to send. Defaults to 200.
   */
  file(fileData, fileName = "download", status = 200) {
    this.header("Content-Disposition", `attachment; filename="${fileName}"`);
    this.binary(fileData, status);
    return this.end();
  }

  /**
   * Redirects the request to the specified URL.
   *
   * @param {string} url - The URL to redirect to.
   * @param {Number} [status=302] - The HTTP status code to send. Defaults to 302.
   * @returns {ResponseHandler} The ResponseHandler instance for chaining.
   */
  redirect(url, status = 302) {
    this.header("Location", url);
    this.status(status); // Set the status
    this.body = null; // No body for redirect
    return this.end(); // End the response
  }

  /**
   * Streams a ReadableStream response. This can be used to return a streaming
   * response from a request handler. The ReadableStream is returned as the
   * response body, and the status and headers are set from the ResponseHandler
   * instance.
   *
   * @param {ReadableStream} readableStream - The ReadableStream to stream as the response.
   */
  stream(readableStream) {
    this.finished = true;
    return new Response(readableStream, {
      status: this.statusCode,
      headers: this.headers,
    });
  }

  /**
   * Sets a cookie in the response.
   *
   * @param {string} name - The cookie name.
   * @param {string} value - The cookie value.
   * @param {Object} options - Optional cookie options (e.g., expires, max-age, path).
   */
  cookie(
    name,
    value,
    { expires, maxAge, path, domain, secure, httpOnly, sameSite } = {}
  ) {
    const cookieString = [
      `${name}=${encodeURIComponent(value)}`,
      expires ? `Expires=${expires.toUTCString()}` : undefined,
      maxAge ? `Max-Age=${maxAge}` : undefined,
      path ? `Path=${path}` : undefined,
      domain ? `Domain=${domain}` : undefined,
      secure ? "Secure" : undefined,
      httpOnly ? "HttpOnly" : undefined,
      sameSite ? `SameSite=${sameSite}` : undefined,
    ]
      .filter(Boolean)
      .join("; ");

    this.header("Set-Cookie", cookieString);
  }

  /**
   * Sends a response with the current status and headers.
   *
   * @param {any} body - The response body. Can be a string, an object, an array buffer, or a readable stream.
   * @param {Object} headers - An object with additional headers to set.
   */
  end() {
    this.finished = true; // Mark as finished
    return new Response(this.body, {
      status: this.statusCode,
      headers: this.headers,
    });
  }
}

export default ResponseHandler;
