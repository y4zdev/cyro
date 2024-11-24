import { Database as SQLite } from "bun:sqlite";
import { mkdirSync, existsSync } from "fs";
import TableManager from "./table.js"; // Import TableManager

class Database {
  constructor() {
    this.connection = null; //connection
    this.table = null; //table
    this.log = true;
    this.throwErr = true; // Throw errors by default
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
   * Initialize the database connection.
   * @param {string} path - Path to the SQLite database file.
   * @param {boolean} strict - Enforce strict mode for SQLite.
   * @param {boolean} stopOnError - Stop on error for SQLite. (this will crash the app) IF YOU DON'T KNOW WHAT YOU'RE DOING, KEEP IT OFF
   */
  init(path = "./database/cyro.db", strict = true, stopOnError = false) {
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

      this.throwErr = stopOnError;

      this.connection = new SQLite(dbFilePath, { strict });
      this.table = new TableManager(this, this.log, this.throwErr);
      this.log && console.log(`DATABASE: Connected at ${dbFilePath}`);
    } catch (error) {
      console.error(`![DATABASE] : Failed to initialize - ${error.message}`);
      if (this.throwErr) throw error;
    }
  }

  /**
   * Insert data into a table.
   * @param {string} tableName - Name of the table.
   * @param {object} data - Data to insert (e.g., { column: value }).
   */
  insert(tableName, data) {
    try {
      Database.validateIdentifier(tableName);
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Data must be a non-array object.");
      }

      const keys = Object.keys(data);
      if (keys.length === 0) {
        throw new Error("Data object must have at least one property.");
      }

      keys.forEach(Database.validateIdentifier);

      const placeholders = keys.map(() => "?").join(", ");
      const values = Object.values(data);

      const query = `INSERT INTO ${tableName} (${keys.join(
        ", "
      )}) VALUES (${placeholders})`;

      this.connection.prepare(query).run(...values);
      this.log && console.log(`DATABASE: Data inserted into '${tableName}'.`);
      return true;
    } catch (error) {
      console.error(`![DATABASE] : Failed to insert data - ${error.message}`);
      if (this.throwErr) throw error;
    }
  }

  /**
   * Update data in a table.
   * @param {string} tableName - Name of the table.
   * @param {object} data - Data to update (e.g., { column: value }).
   * @param {object} filters - Key-value pairs for WHERE conditions.
   */
  update(tableName, data, filters = {}) {
    try {
      Database.validateIdentifier(tableName);

      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Data must be a non-array object.");
      }

      const keys = Object.keys(data);
      if (keys.length === 0) {
        throw new Error("Data object must have at least one property.");
      }

      keys.forEach(Database.validateIdentifier);

      const setClause = keys.map((key) => `${key} = ?`).join(", ");
      const values = Object.values(data);

      const filterKeys = Object.keys(filters);
      const filterValues = Object.values(filters);

      const whereClause = filterKeys.length
        ? `WHERE ${filterKeys.map((key) => `${key} = ?`).join(" AND ")}`
        : "";

      const query = `UPDATE ${tableName} SET ${setClause} ${whereClause}`;
      this.connection.prepare(query).run(...values, ...filterValues);

      this.log && console.log(`DATABASE: Data updated in '${tableName}'.`);
      return true;
    } catch (error) {
      console.error(`![DATABASE] : Failed to update data - ${error.message}`);
      if (this.throwErr) throw error;
    }
  }

  /**
   * Delete data from a table.
   * @param {string} tableName - Name of the table.
   * @param {object} filters - Key-value pairs for WHERE conditions.
   */
  delete(tableName, filters = {}) {
    try {
      Database.validateIdentifier(tableName);

      const filterKeys = Object.keys(filters);
      const filterValues = Object.values(filters);

      const whereClause = filterKeys.length
        ? `WHERE ${filterKeys.map((key) => `${key} = ?`).join(" AND ")}`
        : "";

      const query = `DELETE FROM ${tableName} ${whereClause}`;
      this.connection.prepare(query).run(...filterValues);

      this.log && console.log(`DATABASE: Data deleted from '${tableName}'.`);
      return true;
    } catch (error) {
      console.error(`![DATABASE] : Failed to delete data - ${error.message}`);
      if (this.throwErr) throw error;
    }
  }

  /**
   * Select data from a table with advanced querying options.
   * @param {string} tableName - Name of the table.
   * @param {object} options - Query options: columns, filters, limit, orderBy.
   * @returns {Array<object>} - Array of rows matching the query.
   */
  select(tableName, options = {}) {
    try {
      Database.validateIdentifier(tableName);

      const {
        columns = "*", // Default to all columns
        filters = {}, // Object with conditions for WHERE clause
        limit, // Maximum number of rows to fetch
        orderBy = [], // Array of { column: string, direction: "ASC" | "DESC" }
      } = options;

      // Validate and format selected columns
      const selectedColumns =
        Array.isArray(columns) && columns.length
          ? columns
              .map((col) => {
                Database.validateIdentifier(col);
                return col;
              })
              .join(", ")
          : "*";

      // Build WHERE clause
      const filterKeys = Object.keys(filters);
      const filterConditions = [];
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
          Database.validateIdentifier(key);
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
                Database.validateIdentifier(order.column);
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
      const rows = this.connection.prepare(query).all(...filterValues);

      this.log && console.log(`DATABASE: Query executed - ${query}`);
      return rows || [];
    } catch (error) {
      console.error(
        `![DATABASE] : Failed to execute SELECT query - ${error.message}`
      );
      if (this.throwErr) throw error;
    }
  }

  /**
   * Get a single row from a table based on filters.
   * @param {string} tableName - Name of the table.
   * @param {object} filters - Key-value pairs for WHERE conditions.
   * @returns {object|null} - The first matching row or null.
   */
  get(tableName, filters = {}) {
    try {
      Database.validateIdentifier(tableName);

      if (typeof filters !== "object" || Array.isArray(filters)) {
        throw new Error("Filters must be a non-array object.");
      }

      const keys = Object.keys(filters);
      const values = Object.values(filters);

      // Ensure all column names are valid
      keys.forEach(Database.validateIdentifier);

      const whereClause = keys.length
        ? `WHERE ${keys.map((col) => `${col} = ?`).join(" AND ")}`
        : "";

      const query = `SELECT * FROM ${tableName} ${whereClause} LIMIT 1`;

      const result = this.connection.prepare(query).get(...values);

      if (!result) {
        throw new Error(`No matching record found in table '${tableName}'.`);
      }
      return result || null;
    } catch (error) {
      console.error(`![DATABASE] : Failed to fetch data - ${error.message}`);
      if (this.throwErr) throw error;
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
      console.error(
        `![DATABASE] : Failed to close connection - ${error.message}`
      );
      if (this.throwErr) throw error;
    }
  }
}

export default Database;
