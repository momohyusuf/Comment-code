// Import the module and reference it with the alias vscode in your code below
// The module 'vscode' contains the VS Code extensibility API
const vscode = require("vscode");
const fs = require("node:fs");
// Your extension is activated the very first time the command is executed
const { handleAddCommentToCode } = require("./utils/handlePrompt");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  const globalState = context.globalState;

  // Check if the key is already stored in global state
  const googleApiKey = globalState.get("comment-code.googleApiKey");

  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "comment-code.start",
    async function () {
      // check for google api key
      if (!googleApiKey) {
        // Prompt the user for their key google api key
        let key = await vscode.window.showInputBox({
          prompt: "Please enter you google Api key",
          placeHolder: "Please enter your google API key",
        });

        if (!key) {
          vscode.window.showErrorMessage(
            "Invalid activation key. Please try again."
          );
          return;
        }
        // then save the google key to the global state so it is easy for user to always comeback to your app
        globalState.update("comment-code.googleApiKey", key.trim());
      }
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        // Get the URI of the current file
        const currentFilePath = editor.document.fileName;
        // Display the file path in the console
        const fileContent = fs.readFileSync(currentFilePath, "utf-8");

        await handleAddCommentToCode(fileContent, currentFilePath, context);
      } else {
        vscode.window.showInformationMessage("No active text editor.");
      }
      // Display a message box to the user
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
