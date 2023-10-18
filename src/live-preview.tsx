import Monstrology, { ELEMENT_ICONS, ELE_CLASS, MONSTER_ICONS, MON_CLASS } from "./Main"
import { PluginValue, EditorView, ViewPlugin, ViewUpdate, WidgetType, Decoration, DecorationSet } from "@codemirror/view"
import { RangeSetBuilder } from '@codemirror/state';
import { syntaxTree } from "@codemirror/language";
import { editorLivePreviewField } from "obsidian";
import * as ReactDOM from 'react-dom';

class ElementWidget extends WidgetType {
    constructor(public elementType: string) { 
        super() 
    }

    toDOM(view: EditorView): HTMLElement {
        const span = document.createElement('span')
        span.classList.add(ELE_CLASS);
        console.log('Rendering icon for element type:', ELEMENT_ICONS[this.elementType as keyof typeof ELEMENT_ICONS])
        ReactDOM.render(ELEMENT_ICONS[this.elementType as keyof typeof ELEMENT_ICONS], span);
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
        console.log('Rendering icon for monster type:', MONSTER_ICONS[this.monsterType as keyof typeof MONSTER_ICONS])
        ReactDOM.render(MONSTER_ICONS[this.monsterType as keyof typeof MONSTER_ICONS], span);
        return span;
    }
}


export function MonstrologyLivePlugin(plugin: Monstrology) {
    return ViewPlugin.fromClass(
        class implements PluginValue {
            decorations: DecorationSet

            constructor(view: EditorView) {
                this.decorations = this.buildDecorations(view)
            }

            update(update: ViewUpdate): void {
                this.decorations = this.buildDecorations(update.view)
            }

            private buildDecorations(view: EditorView) {
                // Only for live preview
                if (!view.state.field(editorLivePreviewField)) {
                    return Decoration.none
                }

                // Build the decorations
                const builder = new RangeSetBuilder<Decoration>();

                // List the replacements to be used
                const replacements = [...plugin.monsterReplacements(), ...plugin.elementReplacements()]

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

                            const original = view.state.doc.sliceString(node.from, node.to)
                            for (const replacement of replacements) {
                                if (original.match(replacement.regex)) {
                                    const type = original.split(':')[1].trim();
                                    if (MONSTER_ICONS[type as keyof typeof MONSTER_ICONS]) {
                                        builder.add(
                                            node.from-1,
                                            node.to+1,
                                            Decoration.replace({
                                                widget: new MonstrologyWidget(type),
                                                inclusive: false,
                                                block: false
                                            })
                                        )
                                }else if (ELEMENT_ICONS[type as keyof typeof ELEMENT_ICONS]) {
                                    builder.add(
                                        node.from-1,
                                        node.to+1,
                                        Decoration.replace({
                                            widget: new ElementWidget(type),
                                            inclusive: false,
                                            block: false
                                        })
                                    )
                                }
                            }
                        }}
                    })
                }
                return builder.finish()
            }
        },
        { decorations: (v) => v.decorations }
    )
}