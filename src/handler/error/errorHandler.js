class errHandler {
  #advancedError;
  #message;
  #stack;
  constructor() {
    this.#advancedError = true;
    this.#message = "error object is not defined";
    this.#stack = "";
  }

  /**
   * A function to handle errors.
   * @param {string} where - Where the error occurred (e.g., a function name).
   * @param {string} why - A short description of the error.
   * @param {object} edata - Error data (optional). If provided, the error message and stack are used.
   * The message is used to display the error, and the stack is used to log the error.
   * If the error data is not provided, the error is logged as "error object is not defined".
   */
  print(where = "UNKNOWN", why = "UNKNOWN", edata) {
    if (edata) {
      this.#message = edata.message ?? this.#message;
      this.#stack = edata.stack
        ? edata.stack
            .split("\n")
            .slice(1)
            .map((line) => " ▶ " + line.trim())
            .join("\n")
        : "";
    }
    this.#advancedError
      ? console.error(
          `▶▶ ${where.toUpperCase()} ERROR : ${why}`,
          ` \n ▶ ${this.#message} \n${this.#stack} \n`
        )
      : console.error(`![${where.toUpperCase()}] : ${why} - ${this.#message}`);
  }
}

export default new errHandler();
