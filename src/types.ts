import * as vscode from 'vscode';

export type VSCodeEditor = vscode.TextEditor;
export type VSCodeDocument = vscode.TextDocument;
export type VSCodeRange = vscode.Range;

export interface VSCodeLine {
    selection: vscode.Range;
    text: string;
}
