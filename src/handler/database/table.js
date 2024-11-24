class TableManager {
  constructor(database, log = false, throwErr = true) {
    this.database = database; //database connection
    this.log = log;
    this.throwErr = throwErr;
  }

  /**
   * Validate if the table name is usable.
   * Table names should only contain alphanumeric characters and underscores.
   * @param {string} tableName - Name of the table.
   * @returns {boolean} True if the table name is valid, false otherwise.
   */
  validateTableName(tableName) {
    const validNamePattern = /^[a-zA-Z0-9_]+$/;
    return typeof tableName === "string" && validNamePattern.test(tableName);
  }

  /**
   * Check if a table exists in the database.
   * @param {string} tableName - Name of the table.
   * @returns {boolean} True if the table exists, false otherwise.
   */
  exists(tableName) {
    try {
      if (!this.validateTableName(tableName)) {
        throw new Error(`Invalid table name: '${tableName}'`);
      }

      const query = `
              SELECT name 
              FROM sqlite_master 
              WHERE type='table' AND name=?;
          `;
      const result = this.database.connection.prepare(query).get(tableName);
      return !!result;
    } catch (error) {
      console.error(
        `![DATABASE] : Failed to check table existence - ${error.message}`
      );
      if (this.throwErr) throw error;
    }
  }

  /**
   * Create a table with the specified schema.
   * @param {string} tableName - Name of the table.
   * @param {object} schema - Schema definition (e.g., { columnName: columnType }).
   */
  create(tableName, schema) {
    try {
      if (!this.validateTableName(tableName)) {
        throw new Error(`Invalid table name: '${tableName}'`);
      }

      if (this.exists(tableName)) {
        throw new Error(`Table '${tableName}' already exists.`);
      }

      if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
        throw new Error("Invalid schema. Schema must be an object.");
      }

      const columns = Object.entries(schema)
        .map(([col, type]) => `${col} ${type}`)
        .join(", ");

      if (!columns) {
        throw new Error("Schema must define at least one column.");
      }

      this.database.connection.run(`CREATE TABLE ${tableName} (${columns})`);
      this.log &&
        console.log(`DATABASE: Table '${tableName}' created successfully.`);
    } catch (error) {
      console.error(`![DATABASE] : Failed to create table - ${error.message}`);
      if (this.throwErr) throw error;
    }
  }

  /**
   * Drop a table from the database.
   * @param {string} tableName - Name of the table.
   */
  drop(tableName) {
    try {
      if (!this.validateTableName(tableName)) {
        throw new Error(`Invalid table name: '${tableName}'`);
      }

      if (!this.exists(tableName)) {
        throw new Error(`Table '${tableName}' does not exist.`);
      }

      this.database.connection.run(`DROP TABLE ${tableName}`);
      this.log &&
        console.log(`DATABASE: Table '${tableName}' dropped successfully.`);
    } catch (error) {
      console.error(`![DATABASE] : Failed to drop table - ${error.message}`);
      if (this.throwErr) throw error;
    }
  }
}

export default TableManager;
