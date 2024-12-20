import * as vscode from 'vscode';
import {getSubtitle, getTitle, decorateTitlesAndSubtitles} from './functions';
import {getFileLanguage, getLine, getConfigSettings} from './helpers';

/**
 * To prevent multiple decorations being created and applyed to the same editor
 * This global variable is used as a single decoration reference that is cleared
 * and updated everytime something changes
 */
let activeDecoration: vscode.TextEditorDecorationType | undefined;

export function activate(context: vscode.ExtensionContext) {
    // ------------------------------------------------------ //
    // ------------------- EVENT LISTENERS ------------------ //
    // ------------- TO UPDATE TITLES DECORATION ------------ //
    // ------------------------------------------------------ //

    const decorateOnChange = vscode.workspace.onDidChangeTextDocument(async event => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            activeDecoration = decorateTitlesAndSubtitles(editor, activeDecoration);
        }
    });

    const decorateOnSettingsUpdate = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('code-titler')) {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                activeDecoration = decorateTitlesAndSubtitles(editor, activeDecoration);
            }
        }
    });

    const decorateOnActiveEditor = vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            activeDecoration = decorateTitlesAndSubtitles(editor, activeDecoration);
        }
    });

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
                editBuilder.replace(selection, subtitle + '\n');
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
    // ---------- REZISE TITLES KEYBINDED FUNCTION ---------- //
    // ------------------------------------------------------ //

    const resizeTitles = vscode.commands.registerCommand('code-titler.key-resizeTitles', () => {
        const editor = vscode.window.activeTextEditor;
        const {fill, openTag, closeTag} = getConfigSettings();

        if (editor) {
            const document = editor.document;
            const lineCount = editor.document.lineCount;
            const open = `${openTag} ${fill}`;
            const close = `${fill} ${closeTag}`;
            const language = getFileLanguage(editor);

            // ---- VARIABLE TO HOLD ALL THE NEWTITLES AND RANGES --- //

            const titlesToResize: {range: vscode.Range; newTitle: string}[] = [];

            // ------------ LOOPS THROUGH DOCUMENT LINES ------------ //

            for (let line = 0; line < lineCount; line++) {
                const lineText = document.lineAt(line).text.trim();
                const range = document.lineAt(line).range;

                if (lineText.includes(open) && lineText.includes(close)) {
                    const titleArray = lineText.split(' ');
                    const titleLength = titleArray.length;

                    const rawTitle = titleArray
                        .slice(2, titleLength - 2)
                        .join(' ')
                        .trim();

                    const newTitle = getSubtitle(rawTitle, language);

                    titlesToResize.push({range, newTitle});
                }
            }

            // ----------- CHANGES TITLES ON ACTIVE EDITOR ---------- //

            editor.edit(editBuilder => {
                for (const title of titlesToResize) {
                    editBuilder.replace(title.range, title.newTitle);
                }
            });
        }
    });

    // ------------------------------------------------------ //
    // ----------------- TITLE AND SUBTITLE ----------------- //
    // ----------------- $ SNIPPET FUNCTION ----------------- //
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

    context.subscriptions.push(
        inputCodeTitler,
        keySubtitle,
        keyTitle,
        resizeTitles,
        decorateOnChange,
        decorateOnSettingsUpdate,
        decorateOnActiveEditor
    );
}

export function deactivate() {}
