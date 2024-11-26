import system from "../../controls/system.js";

/**
 * Converts a request to an object containing key-value pairs from the FormData.
 *
 * @param {Request} req - The request object.
 * @returns {Promise<Object>} A promise that resolves to an object containing key-value pairs from the FormData.
 */
async function formtodata(req) {
  try {
    if (!req || typeof req.formData !== "function") {
      throw new Error("Invalid request object or formData method unavailable");
    }

    const formData = await req.formData();
    const dataObj = {};

    for (const [key, value] of formData.entries()) {
      if (key in dataObj) {
        // Ensure the value is an array for multiple entries with the same key
        if (!Array.isArray(dataObj[key])) {
          dataObj[key] = [dataObj[key]];
        }
        dataObj[key].push(value);
      } else {
        dataObj[key] = value;
      }
    }

    return dataObj;
  } catch (error) {
    system.error("addons/toform", "processing Form Data", error);
    return {};
  }
}

export default formtodata;
