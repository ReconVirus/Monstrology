import Monstrology, { ALIGNMENT, ALI_CLASS, ELEMENT, ELE_CLASS, MONSTER, MON_CLASS } from "./Main"
import { PluginValue, EditorView, ViewPlugin, ViewUpdate, WidgetType, Decoration, DecorationSet } from "@codemirror/view"
import { RangeSetBuilder } from '@codemirror/state';
import { syntaxTree } from "@codemirror/language";
import { editorLivePreviewField } from "obsidian";
import * as ReactDOM from 'react-dom';

class AlignmentWidget extends WidgetType {
    constructor(public alignmentType: string) {
        super()
    }

    toDOM(view: EditorView): HTMLElement {
        const span = document.createElement('span')
        span.classList.add(ALI_CLASS);
        console.log('Rendering icon for alignment type:', ALIGNMENT[this.alignmentType as keyof typeof ALIGNMENT]?.icon)
        ReactDOM.render(ALIGNMENT[this.alignmentType as keyof typeof ALIGNMENT].icon, span);
        return span;
    }
}
class ElementWidget extends WidgetType {
    constructor(public elementType: string) { 
        super() 
    }

    toDOM(view: EditorView): HTMLElement {
        const span = document.createElement('span')
        span.classList.add(ELE_CLASS);
        console.log('Rendering icon for element type:', ELEMENT[this.elementType as keyof typeof ELEMENT]?.icon)
        ReactDOM.render(ELEMENT[this.elementType as keyof typeof ELEMENT].icon, span);
        return span;
    }
}
class MonstrologyWidget extends WidgetType {
    constructor(public monsterType: string) { 
        super() 
    }

    toDOM(view: EditorView): HTMLElement {
        const span = document.createElement('span')
        span.classList.add(MON_CLASS);
        console.log('Rendering icon for monster type:', MONSTER[this.monsterType as keyof typeof MONSTER]?.icon)
        ReactDOM.render(MONSTER[this.monsterType as keyof typeof MONSTER].icon, span);
        return span;
    }
}

type TriggerType = 'ali' | 'ele' | 'mon';

function createDecoration(widget: WidgetType) {
    return Decoration.replace({
        widget,
        inclusive: false,
        block: false
    });
}

export function MonstrologyLivePlugin(plugin: Monstrology) {
    return ViewPlugin.fromClass(
        class implements PluginValue {
            decorations: DecorationSet

            constructor(view: EditorView) {
                this.decorations = this.buildDecorations(view)
            }

            update(update: ViewUpdate): void {
                if (update.docChanged || update.selectionSet || update.viewportChanged) {
                    this.decorations = this.buildDecorations(update.view)
                }
            }

            private buildDecorations(view: EditorView) {
                // Only for live preview
                if (!view.state.field(editorLivePreviewField)) {
                    return Decoration.none
                }
            
                // Build the decorations
                const builder = new RangeSetBuilder<Decoration>();
            
                // List the replacements to be used
                const replacements = ['ali', 'ele', 'mon'].flatMap(trigger => plugin.createReplacements(trigger as TriggerType));
            
                for (const {from, to} of view.visibleRanges) {
                    syntaxTree(view.state).iterate({
                        from,
                        to,
                        enter: ({ node }) => {
                            if (!node.type.name.contains('inline-code')) return
                            if (node.type.name.includes('formatting')) return
            
                            for (const range of view.state.selection.ranges) {
                                if (range.from <= node.to+1 && range.to >= node.from-1) return
                            }
            
                            const original = view.state.doc.sliceString(node.from, node.to);
                            for (const replacement of replacements) {
                                if (original.match(replacement.regex)) {
                                    const type = original.split(':')[1].trim();
                                    let widget;
                                    if (MONSTER[type]?.icon) {
                                        widget = new MonstrologyWidget(type);
                                    } else if (ELEMENT[type]?.icon) {
                                        widget = new ElementWidget(type);
                                    } else if (ALIGNMENT[type]?.icon) {
                                        widget = new AlignmentWidget(type);
                                    }

                                    if (widget) {
                                        builder.add(node.from - 1, node.to + 1, createDecoration(widget));
                                    } else {
                                        console.error(`Unexpected type: ${type}`);
                                    }
                                }
                            }
                        }}
                    )
                }
                return builder.finish()
            }
        },
        { decorations: (v) => v.decorations }
    )
}