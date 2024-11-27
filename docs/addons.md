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

**cyro** also includes an addon for retrieving form data from requests:

#### Getting Form Data

```javascript
app.req_post("/form", async (req, res) => {
  const formData = await app.addon.formtodata(req);
  res.send(`Form data received: ${JSON.stringify(formData)}`);
});
```

- **formtodata(req)**: This method extracts the form data from the `req` object (typically sent in `application/x-www-form-urlencoded` or `multipart/form-data` format) and returns it as a JavaScript object.

---

**cyro** also includes an addon for retrieving cookies from requests:

#### Getting Cookies

```javascript
app.req_post("/cookies", async (req, res) => {
  const cookies = await app.addon.getCookies(req);
  res.send(`Cookies received: ${JSON.stringify(cookies)}`);
});
```

- **getCookies(req)**: Extracts cookies from the `req` object and returns them as a JavaScript object.
