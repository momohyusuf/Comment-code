// Import the necessary libraries.
const { GoogleGenerativeAI } = require('@google/generative-ai');
const vscode = require('vscode');
const fs = require('fs');

/**
 * Handle the 'add comment to code' command.
 *
 * @param {string} code_in_file - The code in the file to add comments to.
 * @param {string} path_to_rewrite - The path to the file to rewrite.
 * @param {vscode.ExtensionContext} context - The extension context.
 */
const handleAddCommentToCode = async (
  code_in_file,
  path_to_rewrite,
  context
) => {
  // Get the global state of the extension.
  const globalState = context.globalState;

  // Get the Google API key from the global state.
  const googleApiKey = globalState.get('comment-code.googleApiKey');

  // Show a progress bar to the user.
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      title: 'adding comments to code...',
      cancellable: false,
    },
    async () => {
      try {
        // Create a new Google Generative AI client.
        const genAI = new GoogleGenerativeAI(googleApiKey);

        // Show an information message to the user.
        vscode.window.showInformationMessage('Adding comments to code...');

        // Get the Generative Model for Gemini-Pro.
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Create the prompt for the model.
        const prompt = `You're an senior developer expert at apple add well descriptive comment to this code ${code_in_file}`;

        // Generate the content.
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Remove the ``` characters from the generated code.
        const generatedCode = text.replace(/```/g, ' ');

        // Write the generated code to the file.
        fs.writeFileSync(path_to_rewrite, generatedCode, 'utf-8');

        // Show an information message to the user.
        vscode.window.showInformationMessage('Done code has been re-written');

        // Resolve the promise.
        return Promise.resolve();
      } catch (error) {
        console.error(error);
        // Get the error message.
        const errorMessage = error.stack.slice(0, 44);

        // Show an error message to the user.
        vscode.window.showErrorMessage(
          `${
            errorMessage.includes('API key not valid')
              ? errorMessage
              : 'Something went wrong try again'
          }`
        );

        // Resolve the promise.
        return Promise.resolve();
      }
    }
  );
};

// Export the function.
module.exports = { handleAddCommentToCode };
