/**
 * Converts a request to an object containing key-value pairs from the FormData.
 *
 * @param {Object} req - The request object.
 * @returns {Promise<Object>} A promise that resolves to an object containing key-value pairs from the FormData.
 */

async function toForm(req) {
  //get data
  const formData = await req.formData();

  // Convert FormData to an object
  const dataObj = {};
  for (let [key, value] of formData.entries()) {
    dataObj[key] = value;
  }

  return dataObj;
}

export default toForm;
