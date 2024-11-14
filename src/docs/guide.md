# `PROJECT cyro`

### ABOUT `cyro`

- A backend framework for Bun.js
- Simplifies building web applications and APIs
- Offers essential features like middleware and routing for application organization

---

### ABOUT THE CREATOR

I'm a web developer who enjoys building things from scratch. This project is part of my efforts to improve efficiency by reducing repetitive work. **cyro** is available to everyone for free!

If you'd like to donate or contribute, please feel free to **[contact me](https://www.y4z.dev)**.

**- y4z.dev -**

---

### SPECIAL THANKS

This project is built on [Bun.sh](https://bun.sh), so a huge thanks to the Bun team!

---

### INSTALLING `cyro`

To install cyro in your project, use Bun:

```bash
bun add cyro
```

### SETTING UP `cyro`

Import **cyro** into your project to get started:

```javascript
import App from "cyro";
const app = new App();

app.run(); // default port is 2772, and default start logging is enabled
```

---

### REQUEST HANDLING

cyro provides methods for managing various types of application requests.

#### **`get`**

Handle `GET` requests:

```javascript
app.req_get("/path/get", async (req, res) => {
  res.send("GET request received at '/path/get' route");
});
```

#### **`post`**

Handle `POST` requests:

```javascript
app.req_post("/path/post", async (req, res) => {
  res.send("POST request received at '/path/post' route");
});
```

#### **`put`**

Handle `PUT` requests:

```javascript
app.req_put("/path/put", async (req, res) => {
  res.send("PUT request received at '/path/put' route");
});
```

#### **`delete`**

Handle `DELETE` requests:

```javascript
app.req_delete("/path/delete", async (req, res) => {
  res.send("DELETE request received at '/path/delete' route");
});
```

#### **`patch`**

Handle `PATCH` requests:

```javascript
app.req_patch("/path/patch", async (req, res) => {
  res.send("PATCH request received at '/path/patch' route");
});
```

#### **`head`**

Handle `HEAD` requests:

```javascript
app.req_head("/path/head", async (req, res) => {
  res.send("HEAD request received at '/path/head' route");
});
```

#### **`options`**

Handle `OPTIONS` requests:

```javascript
app.req_options("/path/options", async (req, res) => {
  res.send("OPTIONS request received at '/path/options' route");
});
```

- **URL path**: _(Defines the route for each request type)_
- **req**: _(Request object from the server)_
- **res**: _(Response object for sending replies)_

---

### MIDDLEWARE HANDLING

cyro provides an advanced method for managing application middleware.

- Middleware is executed in a chain, one after the other, until a response is sent, at which point the chain breaks.

#### **`middleware`**

This method allows you to add middleware functions to your application. If a response is sent within a middleware function, the chain will stop.

```javascript
app.middleware(async (req, res) => {
  console.log("EXECUTING MIDDLEWARE 1");
  console.log(`Request received: ${req.url}`); // Log each request's path
});

app.middleware(async (req, res) => {
  console.log("EXECUTING MIDDLEWARE 2");

  res.send("Access Denied", 403); // set response
  return; // Return after setting the response to end middleware execution
});
```

- **req**: _(request object from the server)_
- **res**: _(response object for sending replies)_

---

### RESPONSE HANDLING

cyro provides methods for sending responses easily. To handle responses, you can follow two main concepts:

#### Concept 1: Use `.send` for All-in-One Handling

The `.send` method is useful allowing you to set the body, status, and headers all in one call. cyro will automatically recognize the type of `body` and set the necessary headers for you, eliminating the need for further calls. If the body is `null`, no headers will be added.

##### **Using `.send`**

```javascript
// app.get("/concept1", async (req, res) => {
res.send(body, status, headers);
// });
```

- **body**: _The response `Content-Type` header is automatically set based on the type of `body` (e.g., JSON, text, binary). If `body` is `null`, no headers will be set._
- **status**: _Sets the HTTP status code (default is 200, but you can specify any other)._
- **headers**: _Additional headers can be passed here as an object, though default headers are applied based on the type of `body`._

> Using `.send` avoids the need for additional helper methods such as `.json`, `.text`, `.html`, and so on, making it a more efficient option for processing responses.

---

#### Concept 2: Set Elements Individually with Helper Methods

If you prefer a more modular approach, cyro has methods for setting certain aspects separately, allowing you more control over each component of the response.

##### **Using `.text`, `.status`, and `.setHeader`**

```javascript
// app.get("/concept2", async (req, res) => {
res.text(body); // sets body and Content-Type to "text/plain"
res.status(status); // sets HTTP status code
res.header(headers, value); // send object without value, send single header with value
// });

// app.get("/concept2/new", async (req, res) => {
res.text(body, status, headers); //set by all in one
// });
```

- **body**: _(string)_ Sets the body as plain text. Each helper method (like `.text`) automatically sets an appropriate `Content-Type`.
- **status**: _Allows setting the HTTP status code independently._
- **header**: _Pass additional headers as an object. You can also set a single header with a value by passing a string and its value._

> Using individual methods gives you flexibility, but it requires managing each component separately. This approach is useful when you need fine-grained control over the response.

---

#### **`Send JSON Responses`**

You can send JSON responses using the following methods:

**Method 1:** Using **`send`**

```javascript
// app.get("/json", async (req, res) => {
res.send({ message: "Hello, JSON!" }); // JSON response
// });
```

**Method 2:** Using **`json`**

```javascript
// app.get("/json-explicit", (req, res) => {
res.json({ message: "Explicit JSON" }); // JSON response
// });
```

Both methods automatically set the `Content-Type` to `application/json` and handle JSON formatting for the response.

---

#### **`Send Plain Text Responses`**

You can send plain text responses using the following methods:

**Method 1:** Using **`send`**

```javascript
// app.get("/text", async (req, res) => {
res.send("Hello, plain text!"); // Plain text response
// });
```

**Method 2:** Using **`text`**

```javascript
// app.get("/text-explicit", (req, res) => {
res.text("Explicit plain text response."); // Plain text response
// });
```

Both methods set the `Content-Type` to `text/plain`.

---

#### **`Send HTML Responses`**

You can send HTML responses using the following methods:

**Method 1:** Using **`send`**

```javascript
// app.get("/html", async (req, res) => {
res.send("<h1>Hello, HTML!</h1>"); // HTML response
// });
```

**Method 2:** Using **`html`**

```javascript
// app.get("/html-explicit", (req, res) => {
res.html("<h1>Explicit HTML response</h1>"); // HTML response
// });
```

Both methods set the `Content-Type` to `text/html`.

---

#### **`Send XML Responses`**

You can send XML responses using the following methods:

**Method 1:** Using **`send`**

```javascript
// app.get("/xml", async (req, res) => {
res.send("<message>Hello, XML!</message>"); // XML response
// });
```

**Method 2:** Using **`xml`**

```javascript
// app.get("/xml-explicit", (req, res) => {
res.xml("<message>Explicit XML response</message>"); // XML response
// });
```

Both methods set the `Content-Type` to `application/xml`.

---

#### **`Send Binary Data`**

You can send binary data using the following methods:

**Method 1:** Using **`send`**

```javascript
// app.get("/binary", async (req, res) => {
const binaryData = new Uint8Array([
  /* binary data */
]);
res.send(binaryData); // Binary data response
// });
```

**Method 2:** Using **`binary`**

```javascript
// app.get("/binary-explicit", (req, res) => {
const binaryData = new Uint8Array([
  /* binary data */
]);
res.binary(binaryData); // Binary data response
// });
```

Both methods set the `Content-Type` to `application/octet-stream`.

---

#### **`Send File Downloads`**

You can send files for download using the following methods:

**Method 1:** Using **`send`**

```javascript
// app.get("/download", async (req, res) => {
const fileData = new Uint8Array([
  /* file data */
]);
res.send(fileData); // File download response
// });
```

**Method 2:** Using **`file`**

```javascript
// app.get("/download-explicit", (req, res) => {
const fileData = new Uint8Array([
  /* file data */
]);
res.file(fileData, "example.txt"); // File download response with filename
// });
```

The `file` method sets the `Content-Disposition` header for downloading files.

---

#### **`Send Redirect Responses`**

You can send redirect responses using the following methods:

```javascript
// app.get("/redirect-explicit", (req, res) => {
res.redirect("https://example.com"); // Redirect response
// });
```

The `redirect` method sets the `Location` header and the status code.

---

# THANK YOU !
