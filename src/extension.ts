import * as vscode from 'vscode';

import {getLine, getFileLanguage} from './helpers';
import {getSubtitle, getTitle} from './functions';

export function activate(context: vscode.ExtensionContext) {
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

    const inputSubtitle = vscode.workspace.onDidChangeTextDocument(async event => {
        const editor = vscode.window.activeTextEditor;

        if (editor && event.contentChanges.length > 0) {
            const {selection, text} = getLine(editor);
            const language = getFileLanguage(editor);

            if (text === '$st') {
                setTimeout(async () => {
                    const subtitleInput = await vscode.window.showInputBox({
                        title: 'Subtitle',
                        placeHolder: 'Enter subtitle',
                    });

                    if (subtitleInput === undefined) return;
                    const subtitle = getSubtitle(subtitleInput, language);
                    editor.edit(editBuilder => editBuilder.replace(selection, subtitle));
                }, 100);
            } else if (text === '$t') {
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

    context.subscriptions.push(inputSubtitle, keySubtitle, keyTitle);
}

export function deactivate() {}
