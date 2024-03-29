'use strict'
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import {jsPathTo} from './jsPathTo'
import {parse} from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "copy-json-path" is now active!')

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.copyJsonPath', () => {
        const editor = vscode.window.activeTextEditor
        if (!editor) {
            return
        }

        try {
            let nonQuotedKeyRegex = vscode.workspace
                .getConfiguration('extension.copyJsonPath')
                .get('nonQuotedKeyRegex') as string

            const fileNameAsPrefix = vscode.workspace
                .getConfiguration('extension.copyJsonPath')
                .get('putFileNameInPath') as boolean

            const prefixSeparator = vscode.workspace
                .getConfiguration('extension.copyJsonPath')
                .get('prefixSeparator') as string

            const pathSeparator = vscode.workspace
                .getConfiguration('extension.copyJsonPath')
                .get('pathSeparator') as string

            if (nonQuotedKeyRegex) {
                try {
                    new RegExp(nonQuotedKeyRegex)
                } catch(e) {
                    vscode.window.showErrorMessage(`Invalid regex extension.copyJsonPath.nonQuotedKeyRegex "${nonQuotedKeyRegex}". You can fix it in user preferences.`)
                    console.error('Invalid regex extension.copyJsonPath.nonQuotedKeyRegex', nonQuotedKeyRegex)
                    return
                }
            }

            const text = editor.document.getText()
            // JSON.parse(text)
            let path = jsPathTo(text, editor.document.offsetAt(editor.selection.active), nonQuotedKeyRegex, pathSeparator)

            if (fileNameAsPrefix && !editor.document.isUntitled) {
                /**
                 * If the file has no name, like `.json`, than name will be `.json`.
                 */
                const name = parse(editor.document.fileName).name;

                if (name) {
                  path = `${name}${prefixSeparator}${path}`;
                }  
            }

            vscode.env.clipboard.writeText(path)
        } catch (ex) {
            if (ex instanceof SyntaxError) {
                vscode.window.showErrorMessage(`Invalid JSON.`)
                console.error('Error in copy-json-path', ex)
            } else {
                vscode.window.showErrorMessage(`Couldn't copy path.`)
                console.error('Error in copy-json-path', ex)
            }
        }
    })

    context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() {
}
