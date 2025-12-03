import { Extension } from "@codemirror/state";
import { MarkdownRenderChild, Plugin } from "obsidian";
import { MonstrologyLivePlugin } from "./live-preview";
import MonstrologySettingsTab from "./Settings";
import * as ReactDOM from "react-dom";
import SuggestionIcon from "./SuggestModel";
import { IconType } from "./types";
import { ALIGNMENT, ELEMENT, MONSTER } from "./constant";
import { AllSettings } from "./interfaces/AllSettings";
import { DEFAULT_SETTINGS } from "./constants/defaults";

export default class Monstrology extends Plugin {
	settings: AllSettings;
	private editorExtensions: Extension[] = []
	private userKeyMap: Record<string, string> = {};

	onload = async () => {
		await this.loadSettings();
		this.addSettingTab(new MonstrologySettingsTab(this.app, this));
		this.registerMarkdownPostProcessor(this.markdownPostProcessor.bind(this));
		this.registerEditorExtension(this.editorExtensions);

		const suggest = new SuggestionIcon(this.app, this);
		this.registerEditorSuggest(suggest);

		this.updateExtension();
		console.log("Monstrology loaded");
	}

	loadSettings = async () => {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		this.updateUserKeyMap();
	}
	
	saveSettings = async () => {
		await this.saveData(this.settings);
		this.updateUserKeyMap();
		this.updateExtension();
	}

	updateExtension = () => {
		this.editorExtensions.length = 0;
		this.editorExtensions.push(MonstrologyLivePlugin(this));
		this.app.workspace.updateOptions();
	}

	private updateUserKeyMap () {
		const map: Record<string, string> = {};
		for (const [canonical, label] of Object.entries(this.settings.alignmentsettings)) {
			map[label.toLowerCase()] = canonical;
		}
		for (const [canonical, label] of Object.entries(this.settings.elementsettings)) {
			map[label.toLowerCase()] = canonical;
		}
		for (const [canonical, label] of Object.entries(this.settings.monstersettings)) {
			map[label.toLowerCase()] = canonical;
		}
		this.userKeyMap = {};
	}

	getCanonicalForLabel(label: string | undefined): string | undefined {
		if (!label) return undefined;
		return this.userKeyMap[label.toLowerCase()] ?? label.trim();
	}

	markdownPostProcessor = async (element: HTMLElement) => {
		let codes = element.querySelectorAll('code');
		if(!codes.length) return;

		codes.forEach(codeBlock => {
			const original = codeBlock.innerText.trim();
			const [triggerRaw, typeRaw] = original.split(':');
			if (!triggerRaw || !typeRaw) return;

			const trigger = triggerRaw.trim().toLowerCase();
			const canonical = this.getCanonicalForLabel(typeRaw.trim());
			if (!canonical) return;

			switch (trigger) {
				case 'mon':
					this.addChild(new MonsterMarkdownRenderChild(codeBlock, canonical));
					break;
				case 'ele':
					this.addChild(new ElementMarkdownRenderChild(codeBlock, canonical));
					break;
				case 'ali':
					this.addChild(new AlignmentMarkdownRenderChild(codeBlock, canonical));
					break;
			}
		});
	}
}

class BaseMarkdownRenderChild extends MarkdownRenderChild {
	constructor(
		element: HTMLElement,
		private type: string,
		private iconType: Record<string, JSX.Element>
	) {
		super(element)
	}

	onload = () : void => {
		const typeClass = this.type.toLowerCase();
		const Type = this.containerEl.createSpan({cls: `${typeClass}`})
		const icon = this.iconType[this.type];
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