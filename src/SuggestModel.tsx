import {
    App,
    Editor,
    EditorPosition,
    EditorSuggest,
    EditorSuggestContext,
    EditorSuggestTriggerInfo,
} from 'obsidian';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import Monstrology from './Main';
import { ALIGNMENT, ELEMENT, MONSTER } from './constant';

type TriggerWord = "ali" | "ele" | "mon";

interface SuggestItem {
  label: string;          // user-facing label, e.g. "Wind"
  canonical: string;      // canonical key, e.g. "Air"
  triggerword: TriggerWord;
  icon: JSX.Element;      // render by canonical: ALIGNMENT[canonical] etc.
}

const BACKTICK = '`';

const REGEX_ONGOING_CODE = /^(`)[^`]*$/g; // keep it minimal: single backtick segment

export default class SuggestionIcon extends EditorSuggest<string> {
    private plugin: Monstrology;
    private triggerword?: TriggerWord;
    private currentTriggerWord?: TriggerWord;
    private items: SuggestItem[] = [];

    constructor(app: App, plugin: Monstrology) {
        super(app);
        this.plugin = plugin;
        this.rebuildItems();
    }

    rebuildItems() {
        const alignmentSettings = this.plugin.settings.alignmentsettings;
        const elementSettings = this.plugin.settings.elementsettings;
        const monsterSettings = this.plugin.settings.monstersettings;

        const alignmentItems: SuggestItem[] = Object.entries(alignmentSettings).map(
            ([canonical, label]) => ({
                label: label as string,
                canonical,
                triggerword: "ali",
                icon: ALIGNMENT[canonical]
            })
        );

        const elementItems: SuggestItem[] = Object.entries(elementSettings).map(
            ([canonical, label]) => ({
                label: label as string,
                canonical,
                triggerword: "ele",
                icon: ELEMENT[canonical],
            })
        );

        const monsterItems: SuggestItem[] = Object.entries(monsterSettings).map(
            ([canonical, label]) => ({
                label: label as string,
                canonical,
                triggerword: "mon",
                icon: MONSTER[canonical],
            })
        );

        this.items = [...alignmentItems, ...elementItems, ...monsterItems];
    }

    onTrigger(cursor: EditorPosition, editor: Editor): EditorSuggestTriggerInfo | null {
        const lineText = editor.getLine(cursor.line);

        // Find the nearest opening backtick before the cursor
        const codeStart = lineText.lastIndexOf("`", cursor.ch - 1);
        if (codeStart === -1) return null;

        // Find the nearest closing backtich after the cursor
        const codeEnd = lineText.indexOf("`", cursor.ch);
        if (codeEnd === -1) return null;

        // Ensure we are inside a backtick-enclosed segment
        if (!(codeStart < cursor.ch && cursor.ch <= codeEnd)) return null;
    
        // content inside the backticks
        const content = lineText.slice(codeStart + 1, codeEnd);
        const colonIndex = content.indexOf(":");
        if (colonIndex < 0) return null; // Require colon to show label suggestions

        const twCandidate = content.slice(0, colonIndex).trim().toLowerCase();
        if (!["ali", "ele", "mon"].includes(twCandidate)) return null;
        
        this.triggerword = twCandidate as TriggerWord;

        return {
            start: { line: cursor.line, ch: codeStart },
            end: { line: cursor.line, ch: codeEnd + 1 },
            query: "`" + content,  // what the user sees inside the span, with opening tick
        }
    }

    getSuggestions = (context: EditorSuggestContext): string[] => {
        const segment = context.query.slice(1); // remove the leading backtick
        const colonIndex = segment.indexOf(":");
        const tw = this.triggerword;
        if (!tw || colonIndex < 0) return [];

        // Require colon to show label suggestions
        const typedLabel = segment.slice(colonIndex + 1).toLowerCase();

        const filtered = this.items
            .filter(i => i.triggerword === tw)
            .filter(i => (typedLabel.length > 0 ? i.label.toLowerCase().startsWith(typedLabel) : true));

        this.currentTriggerWord = tw;
        return filtered.map(i => i.label);

    }

    renderSuggestion(suggestionValue: string, el: HTMLElement): void {
        const item = this.items.find(i => i.label === suggestionValue);
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.gap = '0.25rem';
        if (item && React.isValidElement(item.icon)) {
            ReactDOM.render(item.icon, el);
            const textNode = document.createElement('span');
            textNode.textContent = item.label;
            el.appendChild(textNode);
        } else {
            el.textContent = suggestionValue;
        }
    }

    selectSuggestion = (value: string): void => {
        const { editor, start, end } = this.context || {};
        if (!editor || !start || !end) return;

        const tw = this.currentTriggerWord ?? this.triggerword ?? 'ele';
        const replacement = "`" + tw + ":" + value + "`";

        editor.replaceRange(replacement, start, end);

        editor.setCursor({
            line: start.line,
            ch: start.ch + replacement.length,
        });
    }
}