import { Extension } from '@codemirror/state';
import {MarkdownPostProcessor, MarkdownRenderChild, Plugin} from 'obsidian';
import { MonstrologyLivePlugin } from './live-preview';
import MonstrologySettingsTab, { MonstorlogySettings, DEFAULT_SETTINGS } from './Settings';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {GiAlienStare, GiAngelOutfit, GiArchitectMask, GiBatwingEmblem, GiButterfly, GiCursedStar, 
		GiDesertSkull, GiFlatPawPrint, GiHood, GiMaggot, GiMuscleUp,GiStoneTower, GiTombstone} from 'react-icons/gi'
import {FaDragon} from 'react-icons/fa6';
import {PiPlantFill} from 'react-icons/pi';
import {SiElement} from 'react-icons/si';
import { GiDeathSkull, GiLifeSupport, GiMoon, GiStoneSphere, GiSun, GiWaterSplash, GiWhirlwind } from 'react-icons/gi';
import {ImFire} from 'react-icons/im';
import {BsFillLightningFill} from 'react-icons/bs';

export const ELE_CLASS = 'ElementType'
export const MON_CLASS = 'MonsterType'
export const TRIGGER_WORD = 'ele' || 'mon'

const globalStyle = {verticalAlign: 'sub', fontSize: '1.5em'};
export const ELEMENT_ICONS: {
	[key: string]: JSX.Element} = {
	Air: <GiWhirlwind style={{...globalStyle, color:'white'}}/>,
	Dark: <GiMoon style={{...globalStyle, color:'dimgray'}}/>,
	Death: <GiDeathSkull style={{...globalStyle, color:'gainsboro'}}/>,
	Earth: <GiStoneSphere style={{...globalStyle, color:'darkgoldenrod'}}/>,
	Fire: <ImFire style={{...globalStyle, color:'red'}}/>,
	Light: <GiSun style={{...globalStyle, color:'lightgoldenrodyellow'}}/>,
	Lightning: <BsFillLightningFill style={{...globalStyle, color:'lightblue'}}/>,
	Life: <GiLifeSupport style={{...globalStyle, color:'hotpink'}}/>,
	Water: <GiWaterSplash style={{...globalStyle, color:'aqua'}}/>,
}
export const MONSTER_ICONS: { 
	[key: string]: JSX.Element } = {
	Aberration: <GiAlienStare style={{...globalStyle, color: 'darkgray'}}/>,
	Beast: <GiFlatPawPrint style={{...globalStyle, color: 'rebeccapurple'}}/>,
	Celestial: <GiAngelOutfit style={{...globalStyle, color: 'ivory'}}/>,
	Construct: <GiStoneTower style={{...globalStyle, color: 'lightgray'}}/>,
	Cursed: <GiCursedStar style={{...globalStyle, color: 'lightslategray'}}/>,
	Draconid: <FaDragon style={{...globalStyle, color: 'mediumslateblue'}}/>,
	Elementa: <SiElement style={{...globalStyle, color: 'lightblue'}}/>,
	Fairy: <GiButterfly style={{...globalStyle, color: 'orchid'}} />,
	Fiend: <GiDesertSkull style={{...globalStyle, color: 'darkred'}}/>,
	Hybrid: <GiArchitectMask style={{...globalStyle, color: 'palegoldenrod'}}/>,
	Insectoid: <GiMaggot style={{...globalStyle, color: 'yellowgreen'}}/>,
	Necrophage: <GiTombstone style={{...globalStyle, color: 'gray'}}/>,
	Ogroid: <GiMuscleUp style={{...globalStyle, color: 'orange'}}/>,
	Plant: <PiPlantFill style={{...globalStyle, color: 'limegreen'}}/>,
	Specter: <GiHood style={{...globalStyle, color: 'ghostwhite'}}/>,
	Vampire: <GiBatwingEmblem style={{...globalStyle, color: 'crimson'}}/>,
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
	monsterReplacements() {
		const trigger = TRIGGER_WORD
		return [
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*aberration\\s*$`, 'ig'), monsterType: 'Aberration' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*beast\\s*$`, 'ig'), monsterType: 'Beast' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*celestial\\s*$`, 'ig'), monsterType: 'Celestial' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*construct\\s*$`, 'ig'), monsterType: 'Construct' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*cursed\\s*$`, 'ig'), monsterType: 'Cursed' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*draconid\\s*$`, 'ig'), monsterType: 'Draconid' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*elementa\\s*$`, 'ig'), monsterType: 'Elementa' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*fairy\\s*$`, 'ig'), monsterType: 'Fairy' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*fiend\\s*$`, 'ig'), monsterType: 'Fiend' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*hybrid\\s*$`, 'ig'), monsterType: 'Hybrid' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*insectoid\\s*$`, 'ig'), monsterType: 'Insectoid' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*necrophage\\s*$`, 'ig'), monsterType: 'Necrophage' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*ogroid\\s*$`, 'ig'), monsterType: 'Ogroid' },
			{ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*plant\\s*$`, 'ig'), monsterType: 'Plant' },
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
		const monsterReplacements = this.monsterReplacements()
		const elementReplacements = this.elementReplacements()
		codes.forEach(codeBlock => {
			const original = codeBlock.innerText.trim();
			const [trigger, type] = original.split(':');
			if (trigger === 'mon') {
				const replacement = monsterReplacements.find(r => r.monsterType.toLowerCase() === type.toLowerCase());
				if (replacement) {
					this.addChild(new MonsterMarkdownRenderChild(codeBlock, type))
				}
			} else if (trigger === 'ele') {
				const replacement = elementReplacements.find(r => r.elementType.toLowerCase() === type.toLowerCase());
				if (replacement) {
					this.addChild(new ElementMarkdownRenderChild(codeBlock, type))
				}
			}
		})
	}
	
}
export class markdownRenderChild extends MarkdownRenderChild {
    constructor(element: HTMLElement, private type: string) {
        super(element)
    }

    onload() : void {
        const typeClass = this.type.toLowerCase();
        const Type = this.containerEl.createSpan({cls: `${typeClass}`})
        const icon = MONSTER_ICONS[this.type] || ELEMENT_ICONS[this.type]
        ReactDOM.render(icon, Type);
        this.containerEl.replaceWith(Type);
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