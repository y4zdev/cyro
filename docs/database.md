### Database Module for `Cyro` Framework

The **Cyro** framework includes a built-in serverless database system powered by SQLite, providing a simple and efficient API to manage database interactions.

---

### Initializing the Database

To connect to or initialize a database, use the following method:

```javascript
app.db.init(path, strictMode, stopOnError);
```

- **`path`**: The path to the database file (e.g., `./database/main.db`). If the file doesn't exist, it will be automatically created.
- **`strictMode`**: _(Optional)_ Defaults to `true`. Enables strict validation for operations, ensuring that errors are raised for undefined tables or columns.
- **`stopOnError`**: _(Optional)_ Defaults to `false`. If set to `true`, errors will throw and stop execution.

> **Note:** If `stopOnError` is set to `true` and errors are not caught, your application may crash.

**Example:**

```javascript
app.db.init("./database/main.db", true);
```

This example initializes the database file `main.db` in the `./database` directory with strict mode enabled.

---

#### Creating a Table

To create a table, define its columns and types:

```javascript
app.db.table.create(tableName, schema);
```

- **`tableName`**: The name of the table to create.
- **`schema`**: An object defining column names as keys and their types/constraints as values.

**Example:**

```javascript
app.db.table.create("users", {
  id: "INTEGER PRIMARY KEY",
  name: "TEXT NOT NULL",
  email: "TEXT UNIQUE",
  created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
});
```

---

#### Checking if a Table Exists

To check if a table exists:

```javascript
if (app.db.table.exists("users")) {
  console.log("The table 'users' exists.");
}
```

---

#### Dropping a Table

To delete a table and all its data:

```javascript
app.db.table.drop(tableName);
```

- **`tableName`**: The name of the table to drop.

**Example:**

```javascript
app.db.table.drop("users");
```

---

#### Inserting Data

To add data to a table:

```javascript
app.db.insert(tableName, data);
```

- **`tableName`**: The name of the table.
- **`data`**: An object where keys are column names and values are the data to insert.

**Example:**

```javascript
app.db.insert("users", {
  name: "John Doe",
  email: "john.doe@example.com",
});
```

---

#### Fetching Data

To retrieve records with optional filters:

```javascript
const result = app.db.get(tableName, filter);
```

- **`tableName`**: The name of the table to query.
- **`filter`**: _(Optional)_ An object specifying filter conditions (e.g., `{ id: 1 }`).

**Example:**

```javascript
const user = app.db.get("users", { id: 1 });
console.log(user); // Output: { id: 1, name: "John Doe", email: "john.doe@example.com", created_at: "..." }
```

---

#### Updating Data

To modify records in a table:

```javascript
app.db.update(tableName, newData, filter);
```

- **`tableName`**: The name of the table.
- **`newData`**: An object with updated column values.
- **`filter`**: An object specifying conditions for the update.

**Example:**

```javascript
app.db.update("users", { email: "new.email@example.com" }, { id: 1 });
```

---

#### Deleting Data

To remove records from a table:

```javascript
app.db.delete(tableName, filter);
```

- **`tableName`**: The name of the table to delete from.
- **`filter`**: An object specifying conditions for deletion.

**Example:**

```javascript
app.db.delete("users", { id: 1 });
```

---

#### Advanced Querying with Select

Perform custom queries with advanced options:

```javascript
const results = app.db.select({
  table: tableName,
  columns: ["column1", "column2"],
  where: { column1: "value" },
  orderBy: "column1 ASC",
  limit: 10,
  offset: 0,
});
```

- **`table`**: The table to query.
- **`columns`**: _(Optional)_ An array of columns to retrieve. Defaults to `*`.
- **`where`**: _(Optional)_ Filter conditions.
- **`orderBy`**: _(Optional)_ Sorting criteria.
- **`limit`**: _(Optional)_ The maximum number of rows to retrieve.
- **`offset`**: _(Optional)_ The number of rows to skip.

**Example:**

```javascript
const users = app.db.select({
  table: "users",
  columns: ["id", "name"],
  where: { email: "john.doe@example.com" },
  orderBy: "id DESC",
  limit: 5,
});
console.log(users);
```

---

#### Closing the Database Connection

To free up resources, always close the database connection:

```javascript
app.db.close();
```

---

### Error Handling

Cyro's database system provides automatic error handling. When `stopOnError` is set to `false`, operations that fail (e.g., inserting into a non-existent table) will result in an error being thrown, but the application will continue running unless explicitly handled.

**Important Notes:**

- By default, **strict mode is enabled**, ensuring that invalid operations result in immediate errors.
- By default, **stopOnError is disabled**, meaning errors are silently ignored unless explicitly handled.

**Example with `stopOnError` set to `true`:**

- Use **`try...catch`** blocks to handle errors gracefully.
- Log errors to help with debugging.

```javascript
try {
  app.db.insert("users", { name: "Jane Doe" });
} catch (error) {
  console.error("Database error:", error.message);
}
```

In this example, if the table "users" doesn't exist, an error is caught, and the message is logged.

---

# Thank You!

powered by y4z.dev
