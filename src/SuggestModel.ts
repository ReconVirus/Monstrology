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
    triggerWord: string;
}

export default class SuggestionIcon extends EditorSuggest<string> {
    triggerword?: string;
    currentTriggerWord?: string;
    allIcons: Record<string, IconObject>;

    constructor(app: App) {
        super(app);
         // Map each icon to its corresponding trigger word.
        this.allIcons = {
            ...Object.fromEntries(Object.entries(ALIGNMENT).map(([key, value]) => [key, { ...value, triggerWord: 'ali' }])),
            ...Object.fromEntries(Object.entries(ELEMENT).map(([key, value]) => [key, { ...value, triggerWord: 'ele' }])),
            ...Object.fromEntries(Object.entries(MONSTER).map(([key, value]) => [key, { ...value, triggerWord: 'mon' }]))
        };
    }

    onTrigger(cursor: EditorPosition, editor: Editor): EditorSuggestTriggerInfo | null {
        const lineText = editor.getLine(cursor.line);
        const codeStart = lineText.substring(0, cursor.ch).lastIndexOf('`');
    
        // `onTrigger` needs to return `null` as soon as possible to save processing performance.
        if (codeStart === -1) {
            return null;
        }

        // Regex for checking if the code is not done yet.
        const regexOngoingCode = lineText
            .substring(codeStart, cursor.ch)
            .match(/^(`)\w+$/g);
    
        if (regexOngoingCode === null) {
            return null;
        }

          // Extract the trigger word from the context.query.
        this.triggerword = regexOngoingCode[0].split(':')[0].substring(1);
    
        const startingIndex = editor
            .getLine(cursor.line)
            .indexOf(regexOngoingCode[0]);
    
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
    
    getSuggestions(context: EditorSuggestContext): string[] {
        const queryLowerCase = context.query.substring(1).toLowerCase();
    
        // Filter the icons based on the query.
        const iconsNameArray = Object.values(this.allIcons)
            .filter((iconObject: IconObject) =>
                iconObject.value.toLowerCase().startsWith(queryLowerCase),
            )
        if (iconsNameArray.length > 0) {
            this.currentTriggerWord = iconsNameArray[0].triggerWord;
            return iconsNameArray.map((iconObject) => iconObject.value);
        }
    
        return [];
    }
    
    renderSuggestion(value: string, el: HTMLElement): void {
        const iconObject: IconObject = this.allIcons[value];
    
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.gap = '0.25rem';
    
        if (iconObject && React.isValidElement(iconObject.icon)) {
            // Render the icon.
            ReactDOM.render(iconObject.icon, el);
            // Add the value as text.
            const textNode = document.createElement('span');
            textNode.textContent = value;
            el.appendChild(textNode);
        }
    }
    
    selectSuggestion(value: string, evt: MouseEvent | KeyboardEvent): void {
        if (this.context) {
            const { editor, start, end } = this.context;
            if (editor && start && end) {
                editor.replaceRange(`\`${this.currentTriggerWord}:${value}`, start, end);
            }
        }
    }
}