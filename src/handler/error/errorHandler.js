class ErrHandler {
  _advancedError;
  _message;
  _stack;

  constructor() {
    this._advancedError = true;
    this._message = "error object is not defined";
    this._stack = "";
  }

  /**
   * A function to handle errors.
   * @param {string} where - Where the error occurred (e.g., a function name).
   * @param {string} why - A short description of the error.
   * @param {unknown} [edata] - Error data (optional). If provided, the error message and stack are used.
   */
  print(where = "UNKNOWN", why = "UNKNOWN", edata) {
    if (edata instanceof Error) {
      this._message = edata.message ?? this._message;
      this._stack = edata.stack
        ? edata.stack
            .split("\n")
            .slice(1)
            .map((/** @type {string} */ line) => " ▶ " + line.trim())
            .join("\n")
        : "";
    } else {
      this._message = "Invalid error data provided.";
      this._stack = "";
    }

    this._advancedError
      ? console.error(
          `▶▶ ${where.toUpperCase()} ERROR : ${why}`,
          ` \n ▶ ${this._message} \n${this._stack} \n`
        )
      : console.error(`![${where.toUpperCase()}] : ${why} - ${this._message}`);
  }
}

export default new ErrHandler();
