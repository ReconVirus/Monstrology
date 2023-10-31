import { Extension } from "@codemirror/state";
import { MarkdownPostProcessor, MarkdownRenderChild, Plugin } from "obsidian";
import { MonstrologyLivePlugin } from "./live-preview";
import MonstrologySettingsTab, {AllSettings, DEFAULT_SETTINGS,} from "./Settings";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BsFillLightningFill } from "react-icons/bs";
import {
	GiAlienStare,
	GiAngelOutfit,
	GiAngelWings,
	GiArchitectMask,
	GiBatwingEmblem,
	GiBrute,
	GiButterfly,
	GiCrownedSkull,
	GiCursedStar,
	GiDeathSkull,
	GiDesertSkull,
	GiFist,
	GiFlatPawPrint,
	GiHood,
	GiImpLaugh,
	GiLifeSupport,
	GiMaggot,
	GiMoon,
	GiMuscleUp,
	GiPoisonBottle,
	GiScales,
	GiSlime,
	GiStoneSphere,
	GiStoneTower,
	GiSun,
	GiTombstone,
	GiTwoFeathers,
	GiWaterSplash,
	GiWhirlwind,
} from "react-icons/gi";
import { FaDragon, FaHandHoldingHeart, FaRegCircle, FaRegSnowflake } from "react-icons/fa6";
import { ImFire } from "react-icons/im";
import { PiPlantFill } from "react-icons/pi";
import { SiElement } from "react-icons/si";
import SuggestionIcon from "./SuggestModel";

export const ALI_CLASS = "AlignmentType";
export const ELE_CLASS = "ElementType";
export const MON_CLASS = "MonsterType";


const globalStyle = { verticalAlign: "sub", fontSize: "1.5em" };
const generateIcon = (IconComponent: React.ElementType, color: string) => (
	<IconComponent style={{ ...globalStyle, color }} />
);

type TriggerType = 'ali' | 'ele' | 'mon';
type IconType = {
	[key: string]: { value: string; icon: JSX.Element };
};

export const ALIGNMENT:IconType = {
	LG: { value: "LG", icon: generateIcon(GiAngelWings, "lightgoldenrodyellow")},
	NG: { value: "NG", icon: generateIcon(FaHandHoldingHeart, "pink")},
	CG: { value: "CG", icon: generateIcon(GiFist, "dodgerblue")},
	LN: { value: "LN", icon: generateIcon(GiScales, "goldenrod")},
	TN: { value: "TN", icon: generateIcon(FaRegCircle, "white")},
	CN: { value: "CN", icon: generateIcon(GiTwoFeathers, "mediumseagreen")},
	LE: { value: "LE", icon: generateIcon(GiCrownedSkull, "orangered")},
	NE: { value: "NE", icon: generateIcon(GiImpLaugh, "red")},
	CE: { value: "CE", icon: generateIcon(GiBrute, "rebeccapurple")},
};
export const ELEMENT:IconType = {
	Air: { value: "Air", icon: generateIcon(GiWhirlwind, "white")},
	Dark: { value: "Dark", icon: generateIcon(GiMoon, "dimgray")},
	Death: { value: "Death", icon: generateIcon(GiDeathSkull, "gainsboro")},
	Earth: { value: "Earth", icon: generateIcon(GiStoneSphere, "darkgoldenrod")},
	Fire: { value: "Fire", icon: generateIcon(ImFire, "red")},
	Ice: { value: "Ice", icon: generateIcon(FaRegSnowflake, "lightcyan")},
	Light: { value: "Light", icon: generateIcon(GiSun, "lightgoldenrodyellow")},
	Lightning: { value: "Lightning", icon: generateIcon(BsFillLightningFill, "lightblue")},
	Life: { value: "Life", icon: generateIcon(GiLifeSupport, "hotpink")},
	Poison: { value: "Poison", icon: generateIcon(GiPoisonBottle, "lawngreen")},
	Water: { value: "Water", icon: generateIcon(GiWaterSplash, "aqua")},
};
export const MONSTER:IconType = {
	Aberration: { value: "Aberration", icon: generateIcon(GiAlienStare, "darkgray")},
	Beast: { value: "Beast", icon: generateIcon(GiFlatPawPrint, "rebeccapurple")},
	Celestial: { value: "Celestial", icon: generateIcon(GiAngelOutfit, "ivory") },
	Construct: { value: "Construct", icon: generateIcon(GiStoneTower, "lightgray")},
	Cursed: { value: "Cursed", icon: generateIcon(GiCursedStar, "lightslategray")},
	Draconid: { value: "Draconid", icon: generateIcon(FaDragon, "mediumslateblue")},
	Elementa: { value: "Elementa", icon: generateIcon(SiElement, "lightblue")},
	Fairy: { value: "Fairy", icon: generateIcon(GiButterfly, "orchid")},
	Fiend: { value: "Fiend", icon: generateIcon(GiDesertSkull, "darkred")},
	Hybrid: { value: "Hybrid", icon: generateIcon(GiArchitectMask, "palegoldenrod")},
	Insectoid: {value: "Insectoid", icon: generateIcon(GiMaggot, "yellowgreen")},
	Necrophage: { value: "Necrophage", icon: generateIcon(GiTombstone, "gray")},
	Ogroid: { value: "Ogroid", icon: generateIcon(GiMuscleUp, "orange")},
	Ooze: { value: "Ooze", icon: generateIcon(GiSlime, "lightskyblue")},
	Plant: { value: "Plant", icon: generateIcon(PiPlantFill, "limegreen")},
	Specter: { value: "Specter", icon: generateIcon(GiHood, "ghostwhite")},
	Vampire: { value: "Vampire", icon: generateIcon(GiBatwingEmblem, "crimson")},
};
const TRIGGER_TYPES: Record<TriggerType, IconType> = {
	'ali': ALIGNMENT,
	'ele': ELEMENT,
	'mon': MONSTER
};
export default class Monstrology extends Plugin {
	settings: AllSettings;
	private editorExtensions: Extension[] = []

	createReplacements(trigger: TriggerType) {
		const types = TRIGGER_TYPES[trigger];
		return Object.values(types).map(type => {
			const regex = new RegExp(`^\\s*${trigger}\\s*:\\s*${type.value}\\s*$`, 'i');
			return { regex, type: type.value };
		});
	}

	async onload() {
		await this.loadSettings()
		this.addSettingTab(new MonstrologySettingsTab(this.app, this))
		this.registerMarkdownPostProcessor(this.markdownPostProcessor.bind(this))
		this.registerEditorExtension(this.editorExtensions)
		this.registerEditorSuggest(new SuggestionIcon(this.app));
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

	onload() : void {
		const typeClass = this.type.toLowerCase();
		const Type = this.containerEl.createSpan({cls: `${typeClass}`})
		const icon = this.iconType[this.type as keyof typeof this.iconType]?.icon;
		ReactDOM.render(icon, Type);
		this.containerEl.replaceWith(Type);
	}
}

function createMarkdownRenderChildClass(iconType: IconType) {
	return class extends BaseMarkdownRenderChild {
		constructor(element: HTMLElement, type: string) {
			super(element, type, iconType);
		}
	}
}

const AlignmentMarkdownRenderChild = createMarkdownRenderChildClass(ALIGNMENT);
const ElementMarkdownRenderChild = createMarkdownRenderChildClass(ELEMENT);
const MonsterMarkdownRenderChild = createMarkdownRenderChildClass(MONSTER);