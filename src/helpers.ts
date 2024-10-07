import * as vscode from 'vscode';
import type {TextEditorDecorationType} from 'vscode';
import type {VSCodeDocument, VSCodeEditor, VSCodeLine, VSCodeRange, Languages} from './types';

// ------------- GET SETTINGS CONFIGURATION ------------- //

/**
 * Gets the current settings configuration variables
 * @returns An object with all the settings configuration variables
 * Can be used with destructuring to get individual settings ( Like on React Hooks)
 * e.g. const {length, fill} = getConfigSettings();
 *
 */
export const getConfigSettings = () => {
    const config = vscode.workspace.getConfiguration('code-titler');
    const personalisedTags = config.get<boolean>('personalisedTags', false);

    const length = config.get<number>('length', 60);
    const fill = config.get<string>('fill', '-');
    const openTag = config.get<string>('openTag', '//');
    const closeTag = config.get<string>('closeTag', '//');

    const fontColour = config.get<string>('fontColour', 'none');
    const backgroundColour = config.get<string>('backgroundColour', 'none');
    const fontWeight = config.get<string>('fontWeight', 'none');
    const fontStyle = config.get<string>('fontStyle', 'none');

    return {
        config,
        personalisedTags,
        length,
        fill,
        openTag,
        closeTag,
        fontColour,
        backgroundColour,
        fontWeight,
        fontStyle,
    };
};

// ----------------- AVAILABLE LANGUAGES ---------------- //

const {openTag, closeTag} = getConfigSettings();
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
    personalised: {open: `${openTag}`, close: `${closeTag}`},
};

// ------------------------------------------------------ //
// ------------- VSCODE API DOCUMENT HELPERS ------------ //
// ------------------------------------------------------ //

/**
 * Gets the active line in the editor (Where your cursor is)
 * @param editor - The active text editor
 * @returns The active line (selection) and the text (text) in that line
 */
export const getLine = (editor: VSCodeEditor): VSCodeLine => {
    const document: VSCodeDocument = editor.document;
    const range = editor.selection.active.line;
    console.log('helper.ts - line error ' + range);

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

// ------------------------------------------------------ //
// ------------ VSCODE API DECORATION HELPERS ----------- //
// ------------------------------------------------------ //

/**
 *
 * @param options Object with the following properties:
 * - colour: The colour of the decoration
 * - fontWeight: The font weight of the decoration
 * - backgroundColour: The background colour of the decoration
 * They all follow the same format as CSS, e.g. 'red', 'rgb(255, 0, 0)', '#ff0000'
 * @returns A TextEditorDecorationType object
 */
export const getDecoration = (): TextEditorDecorationType => {
    // ------------- GET SETTINGS CONFIGURATION ------------- //
    const {fontColour, backgroundColour, fontWeight, fontStyle} = getConfigSettings();

    return vscode.window.createTextEditorDecorationType({
        color: fontColour,
        backgroundColor: backgroundColour,
        fontWeight: fontWeight,
        fontStyle: fontStyle,
        textDecoration: 'none',
    });
};
