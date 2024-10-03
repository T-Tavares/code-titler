import * as vscode from 'vscode';
import {getLine, getFileLanguage} from './helpers';
import {getSubtitle, getTitle} from './functions';

export function activate(context: vscode.ExtensionContext) {
    // ------------------------------------------------------ //
    // ------------- SUBTITLE KEYBINDED FUNCTION ------------ //
    // ------------------------------------------------------ //

    const keySubtitle = vscode.commands.registerCommand('code-titler.key-getSubtitle', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const language = getFileLanguage(editor);
            const {selection, text} = getLine(editor);
            const subtitle = getSubtitle(text, language);

            editor.edit(editBuilder => {
                editBuilder.replace(selection, subtitle);
            });
        }
    });
    // ------------------------------------------------------ //
    // -------------- TITLE KEYBINDED FUNCTION  ------------- //
    // ------------------------------------------------------ //

    const keyTitle = vscode.commands.registerCommand('code-titler.key-getTitle', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const language = getFileLanguage(editor);
            const {selection, text} = getLine(editor);
            const title = getTitle(text, language);

            editor.edit(editBuilder => {
                editBuilder.replace(selection, title);
            });
        }
    });

    // ------------------------------------------------------ //
    // ---------- SUBTITLE - $ST "SNIPPET" FUNCTION --------- //
    // ------------------------------------------------------ //

    const inputCodeTitler = vscode.workspace.onDidChangeTextDocument(async event => {
        const editor = vscode.window.activeTextEditor;

        if (editor && event.contentChanges.length > 0) {
            const {selection, text} = getLine(editor);
            const language = getFileLanguage(editor);

            // ------------------ SUBTITLE TRIGGER ------------------ //
            if (text.trim() === '$st') {
                setTimeout(async () => {
                    const subtitleInput = await vscode.window.showInputBox({
                        title: 'Subtitle',
                        placeHolder: 'Enter subtitle',
                    });

                    if (subtitleInput === undefined) return;
                    const subtitle = getSubtitle(subtitleInput, language);
                    editor.edit(editBuilder => editBuilder.replace(selection, subtitle));
                }, 100);

                // -------------------- TITLE TRIGGER ------------------- //
            } else if (text.trim() === '$t') {
                setTimeout(async () => {
                    const titleInput = await vscode.window.showInputBox({
                        title: 'Title',
                        placeHolder: 'Enter Title',
                    });

                    if (titleInput === undefined) return;
                    const title = getTitle(titleInput, language);
                    editor.edit(editBuilder => editBuilder.replace(selection, title));
                }, 100);
            }
        }
    });

    // ------------------------------------------------------ //
    // ------------------ EXPORT FUNCTIONS ------------------ //
    // ------------------------------------------------------ //

    context.subscriptions.push(inputCodeTitler, keySubtitle, keyTitle);
}

export function deactivate() {}
