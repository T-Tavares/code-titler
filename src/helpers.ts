import type {VSCodeDocument, VSCodeEditor, VSCodeLine, VSCodeRange, Languages} from './types';

// ----------------- AVAILABLE LANGUAGES ---------------- //

export const LANGUAGES: Languages = {
    javascript: {open: '//', close: '//'},
    typescript: {open: '//', close: '//'},
    python: {open: '#', close: '#'},
    java: {open: '//', close: '//'},
    cpp: {open: '//', close: '//'},
    c: {open: '//', close: '//'},
    csharp: {open: '//', close: '//'},
    ruby: {open: '#', close: '#'},
    php: {open: '#', close: '#'},
    swift: {open: '//', close: '//'},
    go: {open: '//', close: '//'},
    rust: {open: '//', close: '//'},
    html: {open: '<!--', close: '-->'},
    css: {open: '/*', close: '*/'},
    sql: {open: '--', close: '--'},
    shellscript: {open: '#', close: '#'},
    powershell: {open: '#', close: '#'},
    r: {open: '#', close: '#'},
    kotlin: {open: '//', close: '//'},
    scala: {open: '//', close: '//'},
    elixir: {open: '#', close: '#'},
    haskell: {open: '--', close: '--'},
    tcl: {open: '#', close: '#'},
    ['objective-c']: {open: '//', close: '//'},
    lisp: {open: ';', close: ';'},
    lua: {open: '--', close: '--'},
    perl: {open: '#', close: '#'},
};
// ------------------------------------------------------ //
// ------------ VSCODE API HELPER FUNCTIONS ------------- //
// ------------------------------------------------------ //

/**
 * Gets the active line in the editor (Where your cursor is)
 * @param editor - The active text editor
 * @returns The active line (selection) and the text (text) in that line
 */
export const getLine = (editor: VSCodeEditor): VSCodeLine => {
    const document: VSCodeDocument = editor.document;
    const range = editor.selection.active.line;
    const selection: VSCodeRange = document.lineAt(range).range;
    const text = document.getText(selection);

    return {selection, text};
};

/**
 * Gets the language of the active file
 * @param editor -The active text editor
 * @returns The language of the active file as a string
 * Used to determine the comment syntax for the active file
 */
export const getFileLanguage = (editor: VSCodeEditor): keyof Languages => {
    const document: VSCodeDocument = editor.document;
    return document.languageId as keyof Languages;
};
