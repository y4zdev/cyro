import system from "../../controls/system.js";

/**
 * Encodes a given string into Base64Url format.
 *
 * @param {string} str - The input string to encode.
 * @returns {string} - The Base64Url encoded string.
 */
function base64UrlEncode(str) {
  return btoa(str).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

/**
 * Decodes a Base64Url-encoded string.
 *
 * @param {string} str - The Base64Url encoded string to decode.
 * @returns {string|null} - The decoded string, or null if an error occurs.
 */
function base64UrlDecode(str) {
  try {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4 !== 0) {
      str += "=";
    }
    return atob(str);
  } catch (error) {
    system.error("addons/token", "decoding Base64Url", error);
    return null;
  }
}

/**
 * Creates a HMAC SHA-256 signature for the given data and secret.
 *
 * @param {string} data - The data to be signed.
 * @param {string} secret - The secret key used to sign the data.
 * @returns {Promise<string|null>} - The Base64Url encoded signature, or null if an error occurs.
 */
async function createHmacSha256(data, secret) {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const dataToSign = encoder.encode(data);

    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", key, dataToSign);
    const byteArray = new Uint8Array(signature);
    let binary = "";
    for (let i = 0; i < byteArray.byteLength; i++) {
      binary += String.fromCharCode(byteArray[i]);
    }
    return base64UrlEncode(binary);
  } catch (error) {
    system.error("addons/token", "creating HMAC SHA-256 signature", error);
    return null;
  }
}

/**
 * Creates a token with the provided payload and a signature generated using HMAC SHA-256.
 *
 * @param {object} payload - The payload to be included in the token.
 * @param {string} secret - The secret key used to sign the token.
 * @returns {Promise<string|null>} - The generated token, or null if an error occurs.
 */
async function createToken(payload, secret) {
  try {
    if (typeof payload !== "object" || !secret) {
      throw new Error("Invalid payload or secret");
    }

    const header = {
      alg: "HS256",
      typ: "CYRO",
    };

    // Encode header and payload
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    // Create the signature
    const signature = await createHmacSha256(
      `${encodedHeader}.${encodedPayload}`,
      secret
    );

    // Return the complete token
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  } catch (error) {
    system.error("addons/token", "creating token", error);
    return null;
  }
}

/**
 * Verifies a token by checking its signature and decoding its payload.
 *
 * @param {string} token - The token to be verified.
 * @param {string} secret - The secret key used to verify the token's signature.
 * @returns {Promise<object|boolean>} - The decoded payload if the token is valid, or false if invalid.
 */
async function verifyToken(token, secret) {
  try {
    if (!token || !secret) {
      throw new Error("Token or secret is missing");
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    const [encodedHeader, encodedPayload, givenSignature] = parts;

    // Decode header and payload
    const decodedPayload = base64UrlDecode(encodedPayload);
    if (!decodedPayload) {
      throw new Error("Failed to decode payload");
    }

    const parsedPayload = JSON.parse(decodedPayload);

    // Verify the signature
    const expectedSignature = await createHmacSha256(
      `${encodedHeader}.${encodedPayload}`,
      secret
    );

    // Compare signatures
    if (expectedSignature === givenSignature) {
      return parsedPayload;
    } else {
      return false;
    }
  } catch (error) {
    system.error("addons/token", "verifying token", error);
    return false;
  }
}

export { createToken, verifyToken };
