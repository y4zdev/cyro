/**
 * Extracts cookies from the request and returns them as an object.
 *
 * @param {Request} req - The request object containing headers.
 * @returns {Object|boolean} An object with cookie names as keys and their decoded values,
 * or false if no cookies are sent.
 */

function getCookies(req) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return false; // Return false if no cookies are sent

  return Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [name, value] = cookie.split("=");
      return [name, decodeURIComponent(value)];
    })
  );
}

export default getCookies;
