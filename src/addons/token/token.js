import system from "../../controls/system.js";

// Base64Url encode function
function base64UrlEncode(str) {
  return btoa(str).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// Base64Url decode function
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

// Function to create HMAC SHA-256 signature
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
 * Creates a token with the given payload and a signature generated
 * using the HMAC SHA-256 algorithm with the given secret.
 *
 * @param {object} payload - The payload to be signed.
 * @param {string} secret - The secret key.
 * @returns {Promise<string>} - Returns the token.
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
 * Verifies a custom token and reads its header and payload.
 *
 * @param {string} token - The token to be verified.
 * @param {string} secret - The secret key used to verify the token's signature.
 * @returns {Promise<object|boolean>} - Returns the decoded payload if the token is valid, or false if invalid.
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
      // console.warn("Signature mismatch");
      return false;
    }
  } catch (error) {
    system.error("addons/token", "verifying token", error);
    return false;
  }
}

export { createToken, verifyToken };
