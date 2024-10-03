import * as vscode from 'vscode';
import {LANGUAGES} from './helpers';
import type {Languages} from './types';

// ------------------------------------------------------ //
// ---------------- BUILD SUBTITLE STRING --------------- //
// ------------------------------------------------------ //

export const getSubtitle = (rawTitle: string, language: keyof Languages): string => {
    //
    // ----------- GETTINGS CONFIG SETTINGS VALUES ---------- //

    const config = vscode.workspace.getConfiguration('code-titler');
    const length = config.get<number>('length', 60);
    const fill = config.get<string>('fill', '-');
    const personalisedTags = config.get<boolean>('personalisedTags', false);
    const openTag = config.get<string>('openTag', '//');
    const closeTag = config.get<string>('closeTag', '//');

    // --------------- GET OPEN AND CLOSE TAGS -------------- //

    let {open, close} = LANGUAGES[language];

    // ------- IF PERSONALISED TAGS CHANGE ACCORDINGLY ------ //

    if (personalisedTags) {
        open = openTag;
        close = closeTag;
    }

    // ------------------ GET SUBTITLE SIZE ----------------- //
    // ------------- FOR FORMATTING CALCULATIONS ------------ //

    const title = rawTitle.trim();
    const textLength = title.length;
    const isTitleOdd = textLength % 2 !== 0;
    const fillAdjustment = textLength % 2 === 0 ? 8 : 7;
    const fillLength = (length - textLength - fillAdjustment) / 2;

    // ------------------- BUILD SUBTITLE ------------------- //

    const leftfillOutput = fill.repeat(fillLength);
    const rightFillOutput = isTitleOdd ? leftfillOutput.slice(1) : leftfillOutput; // Compensate for odd title length
    const subtitleOutput = `${open} ${leftfillOutput} ${title.toUpperCase()} ${rightFillOutput} ${close}`;

    return subtitleOutput;
};

// ------------------------------------------------------ //
// ----------------- BUILD TITLE STRING ----------------- //
// ------------------------------------------------------ //

export const getTitle = (rawTitle: string, language: keyof Languages): string => {
    //
    // ----------- GETTINGS CONFIG SETTINGS VALUES ---------- //

    const config = vscode.workspace.getConfiguration('code-titler');
    const length = config.get<number>('length', 60);
    const fill = config.get<string>('fill', '-');
    const personalisedTags = config.get<boolean>('personalisedTags', false);
    const openTag = config.get<string>('openTag', '//');
    const closeTag = config.get<string>('closeTag', '//');

    // --------------- GET OPEN AND CLOSE TAGS -------------- //

    let {open, close} = LANGUAGES[language];

    // ------- IF PERSONALISED TAGS CHANGE ACCORDINGLY ------ //

    if (personalisedTags) {
        open = openTag;
        close = closeTag;
    }

    // --------------------- BUILD TITLE -------------------- //

    const topBottom = `${open} ${fill.repeat(length - 6)} ${close}`;
    const titleOutput = `${topBottom}\n${getSubtitle(rawTitle, language)}\n${topBottom}`;
    return titleOutput;
};
