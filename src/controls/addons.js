import { createToken, verifyToken } from "../addons/token/token.js";
import formtodata from "../addons/toform/toform.js";
import getCookies from "../addons/getcookies/getcookies.js";

class Addons {
  //>> TOKEN

  /**
   * Creates a custom token using the given payload and a signature generated
   * using the HMAC SHA-256 algorithm with the given secret.
   *
   * @param {object} payload - The payload to be signed.
   * @param {string} secret - The secret key.
   * @returns {Promise<string|null>} - Returns the token.
   */
  token_create(payload, secret) {
    return createToken(payload, secret);
  }

  /**
   * Verifies a custom token and reads its header and payload.
   *
   * @param {string} token - The token to be verified.
   * @param {string} secret - The secret key used to verify the token's signature.
   * @returns {Promise<object|boolean>} - Returns the decoded payload if the token is valid, or false if the token is invalid.
   */
  token_verify(token, secret) {
    return verifyToken(token, secret);
  }

  //>> TOFORM

  /**
   * Retrieves form data from a request.
   *
   * @param {Request} req - The request object.
   * @returns {Promise<object>} - Returns the parsed form object.
   */
  formtodata(req) {
    return formtodata(req);
  }

  //>> GETCOOKIES

  /**
   * Retrieves cookies from a request.
   *
   * @param {Request} req - The request object.
   * @returns {Object|boolean} - Returns an object with cookie names as keys and their decoded values,
   * or false if no cookies are sent.
   */
  getCookies(req) {
    return getCookies(req);
  }
}

export default Addons;
