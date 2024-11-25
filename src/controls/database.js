import DatabaseHandler from "../handler/database/database.js";

class Database {
  #handler;

  constructor() {
    this.#handler = new DatabaseHandler();
  }

  /**
   * Initialize the database connection.
   * @param {string} path - Path to the SQLite database file.
   * @param {boolean} strict - Enforce strict mode for SQLite.
   * @param {boolean} stopOnError - Stop on error for SQLite. (this will crash the app) IF YOU DON'T KNOW WHAT YOU'RE DOING, KEEP IT OFF
   */
  init(path = "./database/cyro.db", strict = true, stopOnError = false) {
    this.#handler.init(path, strict, stopOnError);
  }

  /**
   * Insert data into a table.
   * @param {string} tableName - Name of the table.
   * @param {object} data - Data to insert (e.g., { column: value }).
   */
  insert(tableName, data) {
    this.#handler.insert(tableName, data);
  }

  /**
   * Update data in a table.
   * @param {string} tableName - Name of the table.
   * @param {object} newData - Data to update (e.g., { column: value }).
   * @param {object} filter - Key-value pairs for WHERE conditions.
   */
  update(tableName, newData, filter = {}) {
    this.#handler.update(tableName, newData, filter);
  }

  /**
   * Delete data from a table.
   * @param {string} tableName - Name of the table.
   * @param {object} filter - Key-value pairs for WHERE conditions.
   */
  delete(tableName, filter = {}) {
    this.#handler.delete(tableName, filter);
  }

  /**
   * Select data from a table with advanced querying options.
   * @param {string} tableName - Name of the table.
   * @param {object} options - Query options: columns, filters, limit, orderBy.
   * @returns {Array<object>} - Array of rows matching the query.
   */
  select(tableName, options = {}) {
    return this.#handler.select(tableName, options);
  }

  /**
   * Get a single row from a table based on filters.
   * @param {string} tableName - Name of the table.
   * @param {object} filters - Key-value pairs for WHERE conditions.
   * @returns {object|null} - The first matching row or null.
   */
  get(tableName, filters = {}) {
    return this.#handler.get(tableName, filters);
  }

  /**
   * Close the database connection.
   */
  close() {
    this.#handler.close();
  }
}

export default Database;
