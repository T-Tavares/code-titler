import * as vscode from 'vscode';
import {LANGUAGES, Languages} from './helpers';

export const getSubtitle = (title: string, language: keyof Languages): string => {
    const config = vscode.workspace.getConfiguration('code-titler');
    const size = config.get<number>('size', 60);
    const fill = config.get<string>('fill', '-');
    const personalisedTags = config.get<boolean>('personalisedTags', false);
    const openTag = config.get<string>('openTag', '//');
    const closeTag = config.get<string>('closeTag', '//');

    let {open, close} = LANGUAGES[language];

    if (personalisedTags) {
        open = openTag;
        close = closeTag;
    }

    const textLength = title.length;
    const isTitleOdd = textLength % 2 !== 0;
    const fillAdjustment = textLength % 2 === 0 ? 8 : 7;
    const fillLength = (size - textLength - fillAdjustment) / 2;

    const leftfillOutput = fill.repeat(fillLength);
    const rightFillOutput = isTitleOdd ? leftfillOutput.slice(1) : leftfillOutput; // Compensate for odd title length
    const subtitleOutput = `${open} ${leftfillOutput} ${title.toUpperCase()} ${rightFillOutput} ${close}`;

    return subtitleOutput;
};

export const getTitle = (title: string, language: keyof Languages): string => {
    const config = vscode.workspace.getConfiguration('code-titler');

    const size = config.get<number>('size', 60);
    const fill = config.get('fill', '-');
    const {open, close} = LANGUAGES[language];

    const topBottom = `${open} ${fill.repeat(size - 6)} ${close}`;
    const titleOutput = `${topBottom}\n${getSubtitle(title, language)}\n${topBottom}`;
    return titleOutput;
};
