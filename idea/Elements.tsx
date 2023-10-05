import { Extension } from '@codemirror/state';
import {MarkdownPostProcessor, MarkdownRenderChild, Plugin} from 'obsidian';
import { MonstrologyLivePlugin } from './live-preview';
import MonstrologySettingsTab, { MonstorlogySettings, DEFAULT_SETTINGS } from './Settings';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GiDeathSkull, GiLifeSupport, GiMoon, GiStoneSphere, GiSun, GiWaterSplash, GiWhirlwind } from 'react-icons/gi';
import {ImFire} from 'react-icons/im';
import {BsFillLightningFill} from 'react-icons/bs';

export const ELE_CLASS = 'ElementType'
export const TRIGGER_WORD = 'ele'

const globalStyle = {verticalAlign: 'sub', fontSize: '1.5em'};

export const ELEMENT_ICONS: {
	[key: string]: JSX.Element} = {
	Air: <GiWhirlwind style={{...globalStyle, color:'white'}}/>,
	Dark: <GiMoon style={{...globalStyle, color:'black'}}/>,
	Death: <GiDeathSkull style={{...globalStyle, color:'white'}}/>,
	Earth: <GiStoneSphere style={{...globalStyle, color:'brown'}}/>,
	Fire: <ImFire style={{...globalStyle, color:'red'}}/>,
	Light: <GiSun style={{...globalStyle, color:'lightgoldenrod'}}/>,
	Lightning: <BsFillLightningFill style={{...globalStyle, color:'lightblue'}}/>,
	Life: <GiLifeSupport style={{...globalStyle, color:'rose'}}/>,
	Water: <GiWaterSplash style={{...globalStyle, color:'aqua'}}/>,
}

export default class Monstrology extends Plugin {
	settings: MonstorlogySettings;
	private editorExtensions: Extension[] = []

	elementReplacements() {
		const trigger = TRIGGER_WORD
		return [
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*air\\s*$`, 'ig'), elementType: 'Air' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*dark\\s*$`, 'ig'), elementType: 'Dark' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*death\\s*$`, 'ig'), elementType: 'Death' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*earth\\s*$`, 'ig'), elementType: 'Earth' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*Fire\\s*$`, 'ig'), elementType: 'Fire' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*light\\s*$`, 'ig'), elementType: 'Light' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*lightning\\s*$`, 'ig'), elementType: 'Lightning' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*life\\s*$`, 'ig'), elementType: 'Life' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*water\\s*$`, 'ig'), elementType: 'Water' },
		]
	}
	async onload() {
		await this.loadSettings()
		this.addSettingTab(new MonstrologySettingsTab(this.app, this))
		this.registerMarkdownPostProcessor(this.markdownPostProcessor.bind(this))
		this.registerEditorExtension(this.editorExtensions)
		this.updateExtension()
		console.log("Monstrology loaded");
	}
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}
	updateExtension(){
		this.editorExtensions.length = 0
		this.editorExtensions.push(MonstrologyLivePlugin(this))
		this.app.workspace.updateOptions()
	}
	async saveSettings(){
		await this.saveData(this.settings)
		this.updateExtension()
	}
	async markdownPostProcessor(element: HTMLElement, context: MarkdownPostProcessor): Promise<any> {
		let codes = element.querySelectorAll('code');
		if(!codes.length) {
			return
		}
		const replacements = this.elementReplacements()
		codes.forEach(codeBlock => {
			for (const replacement of replacements) {
				if (codeBlock.innerText.match(replacement.regex)) {
					const elementType = codeBlock.innerText.split(':')[1].trim();
					this.addChild(new ElementMarkdownRenderChild(codeBlock, elementType))
					break
				}
			}
		})
	}
}

export class ElementMarkdownRenderChild extends MarkdownRenderChild {

	constructor(element: HTMLElement, private elementType: string) {
		super(element)
	}

	onload() : void {
		const elementTypeClass = this.elementType.toLowerCase();
		const Element = this.containerEl.createSpan({cls: `${ELE_CLASS} ${elementTypeClass}`})
		ReactDOM.render(ELEMENT_ICONS[this.elementType], Element)
		this.containerEl.replaceWith(Element);
	}
}