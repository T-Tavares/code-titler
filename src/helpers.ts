import * as vscode from 'vscode';
import type {VSCodeDocument, VSCodeEditor, VSCodeLine, VSCodeRange} from './types';

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

export const getLine = (editor: VSCodeEditor): VSCodeLine => {
    const document: VSCodeDocument = editor.document;

    const range = editor.selection.active.line;
    const selection: VSCodeRange = document.lineAt(range).range;
    const text = document.getText(selection);

    return {selection, text};
};

export const getFileLanguage = (editor: VSCodeEditor): keyof Languages => {
    const document: VSCodeDocument = editor.document;
    return document.languageId as keyof Languages;
};
