import * as vscode from 'vscode';
import type {Languages} from './types';
import {getFileLanguage, getDecoration, getConfigSettings, LANGUAGES} from './helpers';

/**
 *
 * @param rawTitle Takes a string and returns a formatted subtitle all UpperCase
 * @param language Takes file language as string and returns the comment syntax for open and close tags
 * @returns A formatted subtitle string
 */
export const getSubtitle = (rawTitle: string, language: keyof Languages): string => {
    // --------------- GETTING SETTINGS CONFIG -------------- //

    const {personalisedTags, fill, length} = getConfigSettings();
    const languageSelector = personalisedTags ? 'personalised' : language;
    let {open, close} = LANGUAGES[languageSelector] ? LANGUAGES[languageSelector] : LANGUAGES['personalised'];

    // ------------------ GET SUBTITLE SIZE ----------------- //

    const title = rawTitle.trim(); //                                  Remove white space
    const textLength = title.length; //                                Get title length
    const isTitleOdd = textLength % 2 !== 0; //                        Check if title length is odd
    const fillAdjustment = textLength % 2 === 0 ? 8 : 7; //            Compensate for odd title length
    const fillLength = (length - textLength - fillAdjustment) / 2; //  Calculate the fill length
    const titleWhiteSpace = textLength === 0 ? fill : ' '; //          Compensate for empty title

    // ------------------- BUILD SUBTITLE ------------------- //

    const leftfillOutput = fill.repeat(fillLength);
    const rightFillOutput = isTitleOdd ? leftfillOutput.slice(1) : leftfillOutput; // Compensate for odd title length
    /* 
        The subtitle output is a bit busy but if it helps to read. Look a it as a mirror
        openTag + leftFill + titleWhiteSpace + TITLE + titleWhiteSpace + rightFill + closeTag
        Where the titleWhiteSpace is a compensation in case the title is a blank. It completes the fill
    */
    const subtitleOutput = `${open} ${leftfillOutput}${titleWhiteSpace}${title.toUpperCase()}${titleWhiteSpace}${rightFillOutput} ${close}`;

    return subtitleOutput;
};

/**
 *
 * @param rawTitle Takes a string and returns a formatted title
 * @param language Takes file language as string and returns the comment syntax for open and close tags
 * @returns A formatted title string
 */
export const getTitle = (rawTitle: string, language: keyof Languages): string => {
    // --------------- GETTING SETTINGS CONFIG -------------- //

    const {personalisedTags, fill, length} = getConfigSettings();
    const languageSelector = personalisedTags ? 'personalised' : language;
    let {open, close} = LANGUAGES[languageSelector] ? LANGUAGES[languageSelector] : LANGUAGES['personalised'];

    // --------------------- BUILD TITLE -------------------- //

    const topBottom = `${open} ${fill.repeat(length - 6)} ${close}`;
    const titleOutput = `${topBottom}\n${getSubtitle(rawTitle, language)}\n${topBottom}`;
    return titleOutput;
};

/**
 * Decorates the titles and subtitles in the active text editor
 * @param editor Takes the active text editor and decorates the titles and subtitles
 */
export const decorateTitlesAndSubtitles = (
    editor: vscode.TextEditor,
    activeDecoration?: vscode.TextEditorDecorationType
): vscode.TextEditorDecorationType => {
    // --------------- GETTING SETTINGS CONFIG -------------- //
    const config = vscode.workspace.getConfiguration('code-titler');
    const personalisedTags = config.get<boolean>('personalisedTags', false);
    const fill = config.get<string>('fill', '-');

    const documentText = editor.document;
    const documentLines = documentText.lineCount;

    // --------- GET CURRENT LANGUAGE FILL AND TAGS --------- //

    const language = getFileLanguage(editor);

    const languageSelector = personalisedTags ? 'personalised' : language;
    let {open, close} = LANGUAGES[languageSelector];

    const openTag = `${open} ${fill}`;
    const closeTag = `${fill} ${close}`;

    // --------------- CLEAN UP OLD DECORATION -------------- //

    if (activeDecoration) activeDecoration.dispose();
    const titleDecoration = getDecoration();
    const ranges: vscode.Range[] = [];

    // ------------ APPY DECORATION LINE BY LINE ------------ //

    for (let lineIndex = 0; lineIndex < documentLines; lineIndex++) {
        const currentLine = documentText.lineAt(lineIndex);
        const lineText = currentLine.text;

        const openTagIndex = lineText.indexOf(openTag);
        const closeTagIndex = lineText.indexOf(closeTag) + closeTag.length;

        if (openTagIndex === -1 || closeTagIndex === -1) continue;

        const startPos = new vscode.Position(lineIndex, openTagIndex);
        const endPos = new vscode.Position(lineIndex, closeTagIndex);
        const range = new vscode.Range(startPos, endPos);

        ranges.push(range);
    }

    editor.setDecorations(titleDecoration, ranges);

    return titleDecoration;
};
