import {
    App,
    Editor,
    EditorPosition,
    EditorSuggest,
    EditorSuggestContext,
    EditorSuggestTriggerInfo,
} from 'obsidian';
import { ALIGNMENT, ELEMENT, MONSTER } from './Main';
import * as ReactDOM from 'react-dom';
import * as React from 'react';

interface IconObject {
    value: string;
    icon: JSX.Element;
    triggerword: string;
}

function createIconObjects(entries: [string, any][], triggerword: string) {
    return Object.fromEntries(entries.map(([key, value]) => [key, { ...value, triggerword }]));
}

export default class SuggestionIcon extends EditorSuggest<string> {
    triggerword?: string;
    currentTriggerWord?: string;
    allIcons: Record<string, IconObject>;

    constructor(app: App) {
        super(app);
        this.allIcons = {
            ...createIconObjects(Object.entries(ALIGNMENT), 'ali'),
            ...createIconObjects(Object.entries(ELEMENT), 'ele'),
            ...createIconObjects(Object.entries(MONSTER), 'mon')
        };
    }

    onTrigger(cursor: EditorPosition, editor: Editor): EditorSuggestTriggerInfo | null {
        const lineText = editor.getLine(cursor.line);

        const BACKTICK = '`';
        const REGEX_ONGOING_CODE = /^(`)\w+(`)?$/g;

        const codeStart = lineText.substring(0, cursor.ch).lastIndexOf(BACKTICK);
    
        // `onTrigger` needs to return `null` as soon as possible to save processing performance.
        if (codeStart === -1) {
            return null;
        }
    
        // Check if there's a space or a backtick before the shortcode start.
        // This ensures that we're at the start of a new shortcode.
        if (codeStart > 0 && !/\s|`/.test(lineText[codeStart - 1])) {
            return null;
        }

        // Regex for checking if the code is not done yet.
        const regexOngoingCode = lineText
            .substring(codeStart, cursor.ch)
            .match(REGEX_ONGOING_CODE);
    
        if (regexOngoingCode === null) {
            return null;
        }
    
          // Extract the trigger word from the context.query.
        this.triggerword = regexOngoingCode[0].split(':')[0].substring(1);
    
        const startingIndex = lineText.indexOf(regexOngoingCode[0]);
    
        return {
            start: {
                line: cursor.line,
                ch: startingIndex,
            },
            end: {
                line: cursor.line,
                ch: startingIndex + regexOngoingCode[0].length,
            },
            query: regexOngoingCode[0],
        };
    }
    
    getSuggestions = (context: EditorSuggestContext): string[] => {
        const queryLowerCase = context.query.substring(1).toLowerCase();
    
        const iconsNameArray = Object.values(this.allIcons)
            .filter((iconObject: IconObject) =>
                iconObject.value.toLowerCase().startsWith(queryLowerCase),
            ) ?? [];
        if (iconsNameArray.length > 0) {
            this.currentTriggerWord = iconsNameArray[0].triggerword;
            return iconsNameArray.map((iconObject) => iconObject.value);
        }
    
        return [];
    }
    
    renderSuggestion(value: string, el: HTMLElement): void {
        const iconObject: IconObject = this.allIcons[value];
    
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.gap = '0.25rem';
    
        if (React.isValidElement(iconObject.icon)) {
            ReactDOM.render(iconObject.icon, el);
            const textNode = document.createElement('span');
            textNode.textContent = value;
            el.appendChild(textNode);
        }
    }
    
    selectSuggestion = (value: string, evt: MouseEvent | KeyboardEvent): void => {
        const { editor, start, end } = this.context || {};

        if (editor && start && end) {
            const textAfter = editor.getLine(end.line).substring(end.ch, end.ch + 1);
            const hasBacktickAfter = textAfter === '`';
            
            if (hasBacktickAfter) {
                editor.replaceRange('', { line: end.line, ch: end.ch }, { line: end.line, ch: end.ch + 1 });
            }
        
            const BACKTICK = '`';
            const replacement = `${BACKTICK}${this.currentTriggerWord}:${value}${BACKTICK}`;
            
            editor.replaceRange(replacement, start, end);
        }
    }
}