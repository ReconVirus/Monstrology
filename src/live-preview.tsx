import { ALIGNMENT, ELEMENT, MONSTER, CLASS_TYPES } from "./constant";
import Monstrology from "./Main"
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
        span.classList.add(CLASS_TYPES.ALI);
        ReactDOM.render(ALIGNMENT[this.alignmentType], span);
        return span;
    }
}
class ElementWidget extends WidgetType {
    constructor(public elementType: string) { 
        super() 
    }

    toDOM(view: EditorView): HTMLElement {
        const span = document.createElement('span')
        span.classList.add(CLASS_TYPES.ELE);
        ReactDOM.render(ELEMENT[this.elementType], span);
        return span;
    }
}
class MonstrologyWidget extends WidgetType {
    constructor(public monsterType: string) { 
        super() 
    }

    toDOM(view: EditorView): HTMLElement {
        const span = document.createElement('span')
        span.classList.add(CLASS_TYPES.MON);
        ReactDOM.render(MONSTER[this.monsterType], span);
        return span;
    }
}

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
            
                for (const {from, to} of view.visibleRanges) {
                    syntaxTree(view.state).iterate({
                        from,
                        to,
                        enter: ({ node }) => {
                            if (!node.type.name.contains('inline-code')) return
                            if (node.type.name.includes('formatting')) return
            
                            for (const range of view.state.selection.ranges) {
                                if (range.from <= node.to + 1 && range.to >= node.from - 1) return
                            }
            
                            const original = view.state.doc.sliceString(node.from, node.to);
                            const [triggerRaw, typeRaw] = original.split(':');
                            if (!triggerRaw || !typeRaw) return;

                            const trigger = triggerRaw.trim().toLowerCase();
                            const canonical = plugin.getCanonicalForLabel(typeRaw.trim());
                            if (!canonical) return;

                            let widget: WidgetType | undefined;
                            if (MONSTER[canonical]) {
                                widget = new MonstrologyWidget(canonical);
                            } else if (ELEMENT[canonical]) {
                                widget = new ElementWidget(canonical);
                            } else if (ALIGNMENT[canonical]) {
                                widget = new AlignmentWidget(canonical);
                            }

                            if (widget) {
                                builder.add(node.from - 1, node.to + 1, createDecoration(widget));
                            } else {
                                console.error(`Unexpected type: ${canonical}`);
                            }
                        }
                    });
                }
                
                return builder.finish()
            }
        },
        { decorations: (v) => v.decorations }
    )
}