Here's the revised README:

---

# `PROJECT cyro`

### Overview of `cyro`

**cyro** is a backend framework designed for Bun.js, created to simplify the process of building web applications and APIs. With features like middleware and routing, **cyro** helps developers structure their applications with ease.

---

### About the Creator

Hi! I'm a web developer with a passion for creating from the ground up. **cyro** was developed to reduce redundant work and boost development efficiency. It's freely available to everyone.

Feel free to reach out if you'd like to contribute or make a donation: **[contact me](https://www.y4z.dev)**.

**- y4z.dev -**

---

### Special Thanks

A big thank you to the team behind [Bun.sh](https://bun.sh) for making this project possible!

---

### Installation Guide

To add **cyro** to your project, use Bun:

```bash
bun add cyro
```

### Quick Start with `cyro`

Import **cyro** and initialize your application:

```javascript
import App from "cyro";
const app = new App();

app.run(); // Starts on port 2772 with logging enabled by default
```

---

### Handling Requests

**cyro** supports various request types for easy request management:

#### **`GET` Requests**

```javascript
app.req_get("/path/get", async (req, res) => {
  res.send("GET request received at '/path/get'");
});
```

#### **`POST` Requests**

```javascript
app.req_post("/path/post", async (req, res) => {
  res.send("POST request received at '/path/post'");
});
```

#### **`PUT` Requests**

```javascript
app.req_put("/path/put", async (req, res) => {
  res.send("PUT request received at '/path/put'");
});
```

#### **`DELETE` Requests**

```javascript
app.req_delete("/path/delete", async (req, res) => {
  res.send("DELETE request received at '/path/delete'");
});
```

#### **`PATCH` Requests**

```javascript
app.req_patch("/path/patch", async (req, res) => {
  res.send("PATCH request received at '/path/patch'");
});
```

#### **`HEAD` Requests**

```javascript
app.req_head("/path/head", async (req, res) => {
  res.send("HEAD request received at '/path/head'");
});
```

#### **`OPTIONS` Requests**

```javascript
app.req_options("/path/options", async (req, res) => {
  res.send("OPTIONS request received at '/path/options'");
});
```

Each request type has a defined route, a `req` object for the request data, and a `res` object for responses.

---

### Middleware Support

**cyro** allows middleware chaining for better request handling:

```javascript
app.middleware(async (req, res) => {
  console.log("Middleware 1: Processing request", req.url);
});

app.middleware(async (req, res) => {
  console.log("Middleware 2: Further processing");
  res.send("Access Denied", 403);
  return; // Stops further middleware execution
});
```

Middleware functions run sequentially, and the chain halts if a response is sent.

---

### Sending Responses

**cyro** provides flexible methods to send responses:

#### Concept 1: Unified Response with `.send`

```javascript
res.send(body, status, headers);
```

- **body**: Automatically sets `Content-Type` based on the type.
- **status**: Defaults to 200; can be customized.
- **headers**: Additional headers can be provided as an object.

#### Concept 2: Modular Methods

```javascript
res.text("Plain text response"); // Sets body and `Content-Type`
res.status(404); // Custom status code
res.header("Custom-Header", "Value"); // Single header or an object
```

This approach offers precise control over response elements.

---

### Sending Specific Response Types

#### **JSON Responses**

```javascript
res.send({ message: "Hello, JSON!" });
res.json({ message: "Explicit JSON response" });
```

#### **Plain Text Responses**

```javascript
res.send("Hello, plain text!");
res.text("Plain text response");
```

#### **HTML Responses**

```javascript
res.send("<h1>Hello, HTML!</h1>");
res.html("<h1>HTML response</h1>");
```

#### **XML Responses**

```javascript
res.send("<message>Hello, XML!</message>");
res.xml("<message>XML response</message>");
```

#### **Binary Data**

```javascript
const data = new Uint8Array([
  /* binary data */
]);
res.send(data);
res.binary(data);
```

#### **File Downloads**

```javascript
const fileData = new Uint8Array([
  /* file data */
]);
res.file(fileData, "example.txt");
```

#### **Redirects**

```javascript
res.redirect("https://example.com");
```

---

### Addons

**cyro** includes a built-in token system for creating and verifying tokens:

#### Token Creation

```javascript
const payload = { name: "y4z", email: "cyro@y4z.dev" };
const secret = "mySecretKey";

const token = await app.addon.token_create(payload, secret);
console.log(token);
```

#### Token Verification

```javascript
const token = "token_string_here";
const data = await app.addon.token_verify(token, secret);
console.log(data); // Returns data or `false` if invalid
```

---

# Thank You!

---

powered by y4z.dev
