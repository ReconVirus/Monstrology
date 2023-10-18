import { Extension } from "@codemirror/state";
import { MarkdownPostProcessor, MarkdownRenderChild, Plugin } from "obsidian";
import { MonstrologyLivePlugin } from "./live-preview";
import MonstrologySettingsTab, {MonstorlogySettings, DEFAULT_SETTINGS} from "./Settings";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BsFillLightningFill } from "react-icons/bs";
import {
	GiAlienStare,
	GiAngelOutfit,
	GiArchitectMask,
	GiBatwingEmblem,
	GiButterfly,
	GiCursedStar,
	GiDeathSkull,
	GiDesertSkull,
	GiFlatPawPrint,
	GiHood,
	GiLifeSupport,
	GiMaggot,
	GiMoon,
	GiMuscleUp,
	GiPoisonBottle,
	GiSlime,
	GiStoneSphere,
	GiStoneTower,
	GiSun,
	GiTombstone,
	GiWaterSplash,
	GiWhirlwind,
} from "react-icons/gi";
import { FaDragon, FaRegSnowflake } from "react-icons/fa6";
import { ImFire } from "react-icons/im";
import { PiPlantFill } from "react-icons/pi";
import { SiElement } from "react-icons/si";

export const ELE_CLASS = 'ElementType'
export const MON_CLASS = 'MonsterType'
export let TRIGGER_WORD = 'ele' || 'mon'

enum ElementType {
    Air = 'Air',
    Dark = 'Dark',
    Death = 'Death',
    Earth = 'Earth',
    Fire = 'Fire',
	Ice = "Ice",
    Light = 'Light',
    Lightning = 'Lightning',
    Life = 'Life',
	Poison = 'Poison',
    Water = 'Water'
}

enum MonsterType {
    Aberration = 'Aberration',
    Beast = 'Beast',
    Celestial = 'Celestial',
    Construct = 'Construct',
    Cursed = 'Cursed',
    Draconid = 'Draconid',
    Elementa = 'Elementa',
    Fairy = 'Fairy',
    Fiend = 'Fiend',
	Hybrid = 'Hybrid',
	Insectoid = 'Insectoid',
	Necrophage = 'Necrophage',
	Ogroid = 'Ogroid',
	Ooze = 'Ooze',
    Plant = 'Plant',
	Specter = 'Specter',
	Vampire = 'Vampire'
}


const globalStyle = {verticalAlign: 'sub', fontSize: '1.5em'};
const generateIcon = (IconComponent: React.ElementType, color: string) => <IconComponent style={{...globalStyle, color}}/>;

export const ELEMENT_ICONS = {
	Air: generateIcon(GiWhirlwind, 'white'),
	Dark: generateIcon(GiMoon, 'dimgray'),
	Death: generateIcon(GiDeathSkull, 'gainsboro'),
	Earth: generateIcon(GiStoneSphere, 'darkgoldenrod'),
	Fire: generateIcon(ImFire, 'red'),
	Ice: generateIcon(FaRegSnowflake, 'lightcyan'),
	Light: generateIcon(GiSun, 'lightgoldenrodyellow'),
	Lightning: generateIcon(BsFillLightningFill, 'lightblue'),
	Life: generateIcon(GiLifeSupport, 'hotpink'),
	Poison: generateIcon(GiPoisonBottle, 'lawngreen'),
	Water: generateIcon(GiWaterSplash, 'aqua'),
};
export const MONSTER_ICONS = {
	Aberration: generateIcon(GiAlienStare, 'darkgray'),
	Beast: generateIcon(GiFlatPawPrint, 'rebeccapurple'),
	Celestial: generateIcon(GiAngelOutfit, 'ivory'),
	Construct: generateIcon(GiStoneTower, 'lightgray'),
	Cursed: generateIcon(GiCursedStar, 'lightslategray'),
	Draconid: generateIcon(FaDragon, 'mediumslateblue'),
	Elementa: generateIcon(SiElement, 'lightblue'),
	Fairy: generateIcon(GiButterfly, 'orchid'),
	Fiend: generateIcon(GiDesertSkull, 'darkred'),
	Hybrid: generateIcon(GiArchitectMask, 'palegoldenrod'),
	Insectoid: generateIcon(GiMaggot, 'yellowgreen'),
	Necrophage: generateIcon(GiTombstone, 'gray'),
	Ogroid: generateIcon(GiMuscleUp, 'orange'),
	Ooze: generateIcon(GiSlime, 'white'),
	Plant: generateIcon(PiPlantFill, 'limegreen'),
	Specter: generateIcon(GiHood, 'ghostwhite'),
	Vampire: generateIcon(GiBatwingEmblem, 'crimson'),
};

export default class Monstrology extends Plugin {
	settings: MonstorlogySettings;
	private editorExtensions: Extension[] = []

	createReplacements(trigger: string, types: string[]) {
		return types.map(type => ({ regex: new RegExp(`^\\s*${trigger}\\s*:\\s*${type.toLowerCase()}\\s*$`, 'ig'), type }));
	}
	
	elementReplacements() {
		return this.createReplacements('ele', Object.values(ElementType));
	}
	
	monsterReplacements() {
		return this.createReplacements('mon', Object.values(MonsterType));
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
				const replacement = monsterReplacements.find(r => r.type.toLowerCase() === type.toLowerCase());
				if (replacement) {
					this.addChild(new MonsterMarkdownRenderChild(codeBlock, type))
				}
			} else if (trigger === 'ele') {
				const replacement = elementReplacements.find(r => r.type.toLowerCase() === type.toLowerCase());
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
        const icon = MONSTER_ICONS[this.type as keyof typeof MONSTER_ICONS] || ELEMENT_ICONS[this.type as keyof typeof ELEMENT_ICONS]
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
		ReactDOM.render(ELEMENT_ICONS[this.elementType as keyof typeof ELEMENT_ICONS], Element)
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
		ReactDOM.render(MONSTER_ICONS[this.monsterType as keyof typeof MONSTER_ICONS], Monster);
		this.containerEl.replaceWith(Monster);
	}
}