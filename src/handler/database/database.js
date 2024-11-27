import SQLite from "bun:sqlite";
import { mkdirSync, existsSync } from "fs";
import TableManager from "./table.js";
import system from "../../controls/system.js";

class DatabaseHandler {
  constructor() {
    /** @type {SQLite | null} */
    this.connection = null;
    /** @type {TableManager | null} */
    this.table = null;
    /** @type {boolean} */
    this.log = true;
    /** @type {boolean} */
    this.ignoreError = true;
  }

  /**
   * Validate table and column names to prevent injection.
   * @param {string} name - Table or column name to validate.
   */
  static validateIdentifier(name) {
    if (!name || typeof name !== "string" || !/^[a-zA-Z0-9_]+$/.test(name)) {
      throw new Error(`Invalid identifier: ${name}`);
    }
  }

  /**
   * Handle errors and decide whether to throw or ignore them.
   * @param {Error|unknown} error - The error to handle.
   */
  returnError(error) {
    if (!this.ignoreError) throw error;
  }

  /**
   * Initialize the database connection.
   * @param {string} path - Path to the SQLite database file.
   * @param {boolean} strict - Enforce strict mode for SQLite.
   * @param {boolean} ignoreErrors - Ignore SQLite errors. If set to false, any error will crash the app. By default, errors are ignored.
   */
  init(path = "./database/cyro.db", strict = true, ignoreErrors = true) {
    try {
      if (typeof path !== "string" || path.trim() === "") {
        throw new Error("Invalid database path.");
      }

      const dbFilePath = path.replace(/\\/g, "/");
      const dir = dbFilePath.substring(0, dbFilePath.lastIndexOf("/"));

      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
        this.log && console.log(`DATABASE: Directory created at ${dir}`);
      }

      this.ignoreError = !ignoreErrors;

      this.connection = new SQLite(dbFilePath, { strict });
      this.table = new TableManager(this, this.log, this.ignoreError);
      this.log && console.log(`DATABASE: Connected at ${dbFilePath}`);
    } catch (error) {
      system.error("DATABASE", "Failed to initialize", error);
      this.returnError(error);
    }
  }

  /**
   * Insert data into a table.
   * @param {string} tableName - Name of the table.
   * @param {object} data - Data to insert (e.g., { column: value }).
   * @returns {boolean|undefined} - True if the insertion is successful.
   */
  insert(tableName, data) {
    try {
      DatabaseHandler.validateIdentifier(tableName);
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Data must be a non-array object.");
      }

      const keys = Object.keys(data);
      if (keys.length === 0) {
        throw new Error("Data object must have at least one property.");
      }

      keys.forEach((key) => DatabaseHandler.validateIdentifier(key));

      const placeholders = keys.map(() => "?").join(", ");
      const values = Object.values(data);

      const query = `INSERT INTO ${tableName} (${keys.join(
        ", "
      )}) VALUES (${placeholders})`;

      if (!this.connection) {
        throw new Error("No active database connection.");
      }
      this.connection.prepare(query).run(...values);
      this.log && console.log(`DATABASE: Data inserted into '${tableName}'.`);
      return true;
    } catch (error) {
      system.error("DATABASE", "Failed to insert data", error);
      this.returnError(error);
    }
  }

  /**
   * Update data in a table.
   * @param {string} tableName - Name of the table.
   * @param {object} data - Data to update (e.g., { column: value }).
   * @param {object} filters - Key-value pairs for WHERE conditions.
   * @returns {boolean|undefined} - True if the update is successful.
   */
  update(tableName, data, filters = {}) {
    try {
      DatabaseHandler.validateIdentifier(tableName);

      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Data must be a non-array object.");
      }

      const keys = Object.keys(data);
      if (keys.length === 0) {
        throw new Error("Data object must have at least one property.");
      }

      keys.forEach((key) => DatabaseHandler.validateIdentifier(key));

      const setClause = keys.map((key) => `${key} = ?`).join(", ");
      const values = Object.values(data);

      const filterKeys = Object.keys(filters);
      const filterValues = Object.values(filters);

      const whereClause = filterKeys.length
        ? `WHERE ${filterKeys.map((key) => `${key} = ?`).join(" AND ")}`
        : "";

      const query = `UPDATE ${tableName} SET ${setClause} ${whereClause}`;

      if (!this.connection) {
        throw new Error("No active database connection.");
      }
      this.connection.prepare(query).run(...values, ...filterValues);

      this.log && console.log(`DATABASE: Data updated in '${tableName}'.`);
      return true;
    } catch (error) {
      system.error("DATABASE", "Failed to update data", error);
      this.returnError(error);
    }
  }

  /**
   * Delete data from a table.
   * @param {string} tableName - Name of the table.
   * @param {object} filters - Key-value pairs for WHERE conditions.
   * @returns {boolean|undefined} - True if the deletion is successful.
   */
  delete(tableName, filters = {}) {
    try {
      DatabaseHandler.validateIdentifier(tableName);

      const filterKeys = Object.keys(filters);
      const filterValues = Object.values(filters);

      const whereClause = filterKeys.length
        ? `WHERE ${filterKeys.map((key) => `${key} = ?`).join(" AND ")}`
        : "";

      const query = `DELETE FROM ${tableName} ${whereClause}`;

      if (!this.connection) {
        throw new Error("No active database connection.");
      }
      this.connection.prepare(query).run(...filterValues);

      this.log && console.log(`DATABASE: Data deleted from '${tableName}'.`);
      return true;
    } catch (error) {
      system.error("DATABASE", "Failed to delete data", error);
      this.returnError(error);
    }
  }

  /**
   * @typedef {Object} QueryOptions
   * @property {string | string[]} [columns] - Columns to select.
   * @property {Record<string, any>} [filters] - Filter conditions as key-value pairs.
   * @property {string} [limit] - Maximum number of rows to return.
   * @property {Array<{column: string, direction: "ASC" | "DESC"}>} [orderBy] - Columns and sort order.
   */

  /**
   * Select data from a table with advanced querying options.
   * @param {string} tableName - Name of the table.
   * @param {QueryOptions} [options={}] - Query options.
   * @returns {Array<object>|undefined} - Array of rows matching the query.
   */
  select(tableName, options = {}) {
    try {
      DatabaseHandler.validateIdentifier(tableName);

      const {
        columns = "*",
        filters = {},
        limit = undefined,
        orderBy = [],
      } = options;

      // Validate and format selected columns
      const selectedColumns =
        Array.isArray(columns) && columns.length
          ? columns
              .map((col) => {
                DatabaseHandler.validateIdentifier(col);
                return col;
              })
              .join(", ")
          : "*";

      // Build WHERE clause
      const filterKeys = Object.keys(filters);
      /**@type {string[]} */
      const filterConditions = [];
      /**@type {string[]} */
      const filterValues = [];

      filterKeys.forEach((key) => {
        const value = filters[key];

        // Handle operators like >, <, >=, <=, !=, and LIKE
        if (typeof value === "object" && value !== null) {
          const { operator, value: val } = value;
          if (!["=", "!=", ">", "<", ">=", "<=", "LIKE"].includes(operator)) {
            throw new Error(
              `Unsupported operator '${operator}' for filter '${key}'.`
            );
          }
          filterConditions.push(`${key} ${operator} ?`);
          filterValues.push(val);
        } else {
          // Default to equality if no operator is provided
          DatabaseHandler.validateIdentifier(key);
          filterConditions.push(`${key} = ?`);
          filterValues.push(value);
        }
      });

      const whereClause = filterConditions.length
        ? `WHERE ${filterConditions.join(" AND ")}`
        : "";

      // Build ORDER BY clause
      const orderClause =
        Array.isArray(orderBy) && orderBy.length
          ? `ORDER BY ${orderBy
              .map((order) => {
                DatabaseHandler.validateIdentifier(order.column);
                const direction =
                  order.direction?.toUpperCase() === "DESC" ? "DESC" : "ASC";
                return `${order.column} ${direction}`;
              })
              .join(", ")}`
          : "";

      // Build LIMIT clause
      const limitClause = limit ? `LIMIT ${parseInt(limit, 10)}` : "";

      // Final SQL query
      const query = `SELECT ${selectedColumns} FROM ${tableName} ${whereClause} ${orderClause} ${limitClause}`;

      if (!this.connection) {
        throw new Error("No active database connection.");
      }
      const rows = this.connection.prepare(query).all(...filterValues);

      this.log && console.log(`DATABASE: Query executed - ${query}`);
      return rows || [];
    } catch (error) {
      system.error("DATABASE", "Failed to execute SELECT query", error);
      this.returnError(error);
    }
  }

  /**
   * Get a single row from a table based on filters.
   * @param {string} tableName - Name of the table.
   * @param {object} filters - Key-value pairs for WHERE conditions.
   * @returns {object|undefined} - The first matching row or null.
   */
  get(tableName, filters = {}) {
    try {
      DatabaseHandler.validateIdentifier(tableName);

      if (typeof filters !== "object" || Array.isArray(filters)) {
        throw new Error("Filters must be a non-array object.");
      }

      const keys = Object.keys(filters);
      const values = Object.values(filters);

      // Ensure all column names are valid
      keys.forEach((key) => DatabaseHandler.validateIdentifier(key));

      const whereClause = keys.length
        ? `WHERE ${keys.map((col) => `${col} = ?`).join(" AND ")}`
        : "";

      const query = `SELECT * FROM ${tableName} ${whereClause} LIMIT 1`;

      if (!this.connection) {
        throw new Error("No active database connection.");
      }
      const result = this.connection.prepare(query).get(...values);

      if (!result) {
        throw new Error(`No matching record found in table '${tableName}'.`);
      }
      return result || null;
    } catch (error) {
      system.error("DATABASE", "Failed to fetch data", error);
      this.returnError(error);
    }
  }

  /**
   * Close the database connection.
   */
  close() {
    try {
      if (!this.connection) {
        throw new Error("No active database connection to close.");
      }

      this.connection.close();
      this.connection = null;
      if (this.log) {
        console.log("DATABASE: Connection successfully closed.");
      }
    } catch (error) {
      system.error("DATABASE", "Failed to close connection", error);
      this.returnError(error);
    }
  }
}

export default DatabaseHandler;
