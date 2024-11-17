// Base64Url encode function
function base64UrlEncode(str) {
  return btoa(str).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// Base64Url decode function
function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4 !== 0) {
    str += "=";
  }
  return atob(str);
}

// Function to create HMAC SHA-256 signature
async function createHmacSha256(data, secret) {
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
}

/**
 * Creates a  Token  with the given payload and a signature generated
 * using the HMAC SHA-256 algorithm with the given secret.
 *
 * @param {object} payload - The payload to be signed.
 * @param {string} secret - The secret key.
 * @returns {Promise<string>} - Returns the token.
 */
async function createToken(payload, secret) {
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
}

/**
 * Verifies a custom token and reads its header and payload.
 *
 * @param {string} token - The token to be verified.
 * @param {string} secret - The secret key used to verify the token's signature.
 * @returns {Promise<object>} - Returns the decoded payload if the token is valid, or false if the token is invalid.
 */
async function verifyToken(token, secret) {
  const [encodedHeader, encodedPayload, givenSignature] = token.split(".");

  // Decode header and payload
  const decodedPayload = JSON.parse(base64UrlDecode(encodedPayload));

  // Verify the signature
  const expectedSignature = await createHmacSha256(
    `${encodedHeader}.${encodedPayload}`,
    secret
  );

  // Return
  if (expectedSignature === givenSignature) {
    return decodedPayload;
  } else {
    return false;
  }
}

export { createToken, verifyToken };
