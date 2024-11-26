import system from "../../controls/system.js";

/**
 * Extracts cookies from the request and returns them as an object.
 *
 * @param {Request} req - The request object containing headers.
 * @returns {Object|boolean} An object with cookie names as keys and their decoded values,
 * or false if no cookies are sent.
 */

function getCookies(req) {
  try {
    if (!req || !req.headers || typeof req.headers.get !== "function") {
      throw new Error("Invalid request object");
    }

    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) return false; // Return false if no cookies are sent

    // Parse and decode cookies
    return Object.fromEntries(
      cookieHeader.split("; ").map((cookie) => {
        const [name, value] = cookie.split("=");
        if (!name || value === undefined) {
          throw new Error("Malformed cookie");
        }
        return [name, decodeURIComponent(value)];
      })
    );
  } catch (error) {
    system.error("addons/getcookies", "parsing cookies", error);
    return false; // Return false if any error occurs
  }
}

export default getCookies;
