// Require the necessary modules.
const vscode = require('vscode');
const axios = require('axios');

/**
 * Handle activation key validation.
 * @param {string} key - The activation key to validate.
 * @returns {Promise<boolean>} A promise that resolves to true if the key is valid, false otherwise.
 */
async function handleActivationKeyValidation(key) {
  try {
    // Send a POST request to the server to validate the activation key.
    const res = await axios.post(
      'https://curious-bear-cummerbund.cyclic.app/api/validate',
      {
        activationKey: key,
      }
    );

    // Check if the key is valid.
    return !!res.data.message;
  } catch (error) {
    console.log(error);
    // If an error occurs, show an error message to the user.
    vscode.window.showErrorMessage(
      error.response.data.message || 'Sorry something went wrong try again'
    );

    // Return false to indicate that the key is invalid.
    return false;
  }
}

// Export the function so that it can be used in other modules.
module.exports = handleActivationKeyValidation;
