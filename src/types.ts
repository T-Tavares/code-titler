import * as vscode from 'vscode';

// ------------------ VS-CODE API TYPES ----------------- //

export type VSCodeEditor = vscode.TextEditor;
export type VSCodeDocument = vscode.TextDocument;
export type VSCodeRange = vscode.Range;

export interface VSCodeLine {
    selection: vscode.Range;
    text: string;
}
// ------------------- LANGUAGE TYPES ------------------- //

export interface Languages {
    javascript: {open: string; close: string};
    typescript: {open: string; close: string};
    python: {open: string; close: string};
    java: {open: string; close: string};
    cpp: {open: string; close: string};
    c: {open: string; close: string};
    csharp: {open: string; close: string};
    ruby: {open: string; close: string};
    php: {open: string; close: string};
    swift: {open: string; close: string};
    go: {open: string; close: string};
    rust: {open: string; close: string};
    html: {open: string; close: string};
    css: {open: string; close: string};
    sql: {open: string; close: string};
    shellscript: {open: string; close: string};
    powershell: {open: string; close: string};
    r: {open: string; close: string};
    kotlin: {open: string; close: string};
    scala: {open: string; close: string};
    elixir: {open: string; close: string};
    haskell: {open: string; close: string};
    tcl: {open: string; close: string};
    ['objective-c']: {open: string; close: string};
    lisp: {open: string; close: string};
    lua: {open: string; close: string};
    perl: {open: string; close: string};
}
