import { Extension } from "@codemirror/state";
import { MarkdownPostProcessor, MarkdownRenderChild, Plugin } from "obsidian";
import { MonstrologyLivePlugin } from "./live-preview";
import MonstrologySettingsTab, {AllSettings, DEFAULT_SETTINGS,} from "./Settings";
import * as ReactDOM from "react-dom";
import SuggestionIcon from "./SuggestModel";
import { IconType, TriggerType } from "./types";
import { ALIGNMENT, ELEMENT, MONSTER, TRIGGER_TYPES } from "./constant";

const VALUE_TO_KEY: { [key: string]: string } = {};

export default class Monstrology extends Plugin {
	settings: AllSettings;
	private editorExtensions: Extension[] = []

	createReplacements = (trigger: TriggerType) => {
    const types = TRIGGER_TYPES[trigger];
    return Object.keys(types).map(key => {
        const { value } = types[key];
        const regex = new RegExp(`^\\s*${trigger}\\s*:\\s*${key}\\s*$`, 'i');
        return { regex, type: value };
    });
	}

	onload = async () => {
		await this.loadSettings();
		this.addSettingTab(new MonstrologySettingsTab(this.app, this));
		this.registerMarkdownPostProcessor(this.markdownPostProcessor.bind(this));
		this.registerEditorExtension(this.editorExtensions);
		this.registerEditorSuggest(new SuggestionIcon(this.app));
		this.updateExtension();
		console.log("Monstrology loaded");
	}

	loadSettings = async () => {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		Object.keys(this.settings).forEach(key => {
			const value = this.settings[key];
			VALUE_TO_KEY[value] = key;
		});
	}

	updateExtension = () => {
		this.editorExtensions.length = 0;
		this.editorExtensions.push(MonstrologyLivePlugin(this));
		this.app.workspace.updateOptions();
	}

	saveSettings = async () => {
		await this.saveData(this.settings);
		Object.keys(this.settings).forEach(key => {
			const value = this.settings[key];
			VALUE_TO_KEY[value] = key;
		})
		this.updateExtension();
	}
	markdownPostProcessor = async (element: HTMLElement, context: MarkdownPostProcessor) => {
		let codes = element.querySelectorAll('code');
		if(!codes.length) {
			return
		}
		codes.forEach(codeBlock => {
			const original = codeBlock.innerText.trim();
			const [trigger, type] = original.split(':');
			const replacements = this.createReplacements(trigger as TriggerType);
			const replacement = replacements.find(r => r.type.toLowerCase() === type.toLowerCase());
			if (replacement) {
				switch (trigger) {
					case 'mon':
						this.addChild(new MonsterMarkdownRenderChild(codeBlock, type));
						break;
					case 'ele':
						this.addChild(new ElementMarkdownRenderChild(codeBlock, type));
						break;
					case 'ali':
						this.addChild(new AlignmentMarkdownRenderChild(codeBlock, type));
						break;
				}
			}
		})
	}
}
class BaseMarkdownRenderChild extends MarkdownRenderChild {
	constructor(element: HTMLElement, private type: string, private iconType: Record<string, {value: string, icon: JSX.Element}>) {
		super(element)
	}

	onload = () : void => {
		const typeClass = this.type.toLowerCase();
		const Type = this.containerEl.createSpan({cls: `${typeClass}`})
		const iconKey = this.type;
		const icon = this.iconType[iconKey as keyof typeof this.iconType]?.icon;
		ReactDOM.render(icon, Type);
		this.containerEl.replaceWith(Type);
	}
}

const createMarkdownRenderChildClass = (iconType: IconType) => {
	return class extends BaseMarkdownRenderChild {
		constructor(element: HTMLElement, type: string) {
			super(element, type, iconType);
		}
	}
}

const AlignmentMarkdownRenderChild = createMarkdownRenderChildClass(ALIGNMENT);
const ElementMarkdownRenderChild = createMarkdownRenderChildClass(ELEMENT);
const MonsterMarkdownRenderChild = createMarkdownRenderChildClass(MONSTER);