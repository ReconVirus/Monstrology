import { Extension } from '@codemirror/state';
import {MarkdownPostProcessor, MarkdownRenderChild, Plugin} from 'obsidian';
import { MonstrologyLivePlugin } from './live-preview';
import MonstrologySettingsTab, { MonstorlogySettings, DEFAULT_SETTINGS } from './Settings';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {GiBatwingEmblem, GiCursedStar, GiDoubleFaceMask, GiFlatPawPrint, GiHood, GiMaggot, GiMuscleUp, GiTombstone} from 'react-icons/gi'
import {FaDragon} from 'react-icons/fa6'
import {SiElement} from 'react-icons/si'

export const MON_CLASS = 'MonsterType'
export const TRIGGER_WORD = 'mon'

const globalStyle = {verticalAlign: 'sub', fontSize: '1.5em'};

export const MONSTER_ICONS: { 
	[key: string]: JSX.Element } = {
	Beast: <GiFlatPawPrint style={{...globalStyle, color: 'darkmagenta'}}/>,
	Cursed: <GiCursedStar style={{...globalStyle, color: 'ghostwhite'}}/>,
	Draconid: <FaDragon style={{...globalStyle, color: 'gold'}}/>,
	Elementa: <SiElement style={{...globalStyle, color: 'lightblue'}}/>,
	Hybrid: <GiDoubleFaceMask style={{...globalStyle, color: 'yellow'}}/>,
	Insectoid: <GiMaggot style={{...globalStyle, color: 'yellowgreen'}}/>,
	Necrophage: <GiTombstone style={{...globalStyle, color: 'gray'}}/>,
	Ogroid: <GiMuscleUp style={{...globalStyle, color: 'orange'}}/>,
	Specter: <GiHood style={{...globalStyle, color: 'ghostwhite'}}/>,
	Vampire: <GiBatwingEmblem style={{...globalStyle, color: 'crimson'}}/>,
}

export default class Monstrology extends Plugin {
	settings: MonstorlogySettings;
	private editorExtensions: Extension[] = []

	monsterReplacements() {
		const trigger = TRIGGER_WORD
		return [
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*beast\\s*$`, 'ig'), monsterType: 'Beast' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*cursed\\s*$`, 'ig'), monsterType: 'Cursed' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*draconid\\s*$`, 'ig'), monsterType: 'Draconid' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*elementa\\s*$`, 'ig'), monsterType: 'Elementa' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*hybrid\\s*$`, 'ig'), monsterType: 'Hybrid' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*insectoid\\s*$`, 'ig'), monsterType: 'Insectoid' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*necrophage\\s*$`, 'ig'), monsterType: 'Necrophage' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*ogroid\\s*$`, 'ig'), monsterType: 'Ogroid' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*specter\\s*$`, 'ig'), monsterType: 'Specter' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*vampire\\s*$`, 'ig'), monsterType: 'Vampire' },
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
		const replacements = this.monsterReplacements()
		codes.forEach(codeBlock => {
			for (const replacement of replacements) {
				if (codeBlock.innerText.match(replacement.regex)) {
					const monsterType = codeBlock.innerText.split(':')[1].trim();
					this.addChild(new MonsterMarkdownRenderChild(codeBlock, monsterType))
					break
				}
			}
		})
	}
}

class MonsterMarkdownRenderChild extends MarkdownRenderChild {

	constructor(element: HTMLElement, private monsterType: string) {
		super(element)
	}

	onload() : void {
		const monsterTypeClass = this.monsterType.toLowerCase();
		const Monster = this.containerEl.createSpan({cls: `${MON_CLASS} ${monsterTypeClass}`})
		ReactDOM.render(MONSTER_ICONS[this.monsterType], Monster);
		this.containerEl.replaceWith(Monster);
	}
}