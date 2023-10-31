import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import Monstrology, { ALIGNMENT, CLASS_TYPES, ELEMENT, IconType, MONSTER, } from "./Main";
import * as ReactDOM from "react-dom";

export interface AlignmentSettings {
    [key: string]: string,
    LG: string,
    NG: string,
    CG: string,
    LN: string,
    TN: string,
    CN: string,
    LE: string,
    NE: string,
    CE: string,
}
export interface ElementSettings {
    [key: string]: string,
    Air: string,
    Dark: string,
    Death: string,
    Earth: string,
    Fire: string,
    Ice: string,
    Light: string,
    Lightning: string,
    Life: string,
    Poison: string,
    Water: string,
}
export interface MonsterSettings {
    [key: string]: string,
    Aberration: string,
    Beast: string;
    Celestial: string;
    Construct: string;
    Cursed: string;
    Draconid: string;
    Elementa: string;
    Fairy: string,
    Fiend: string,
    Hybrid: string;
    Insectoid: string;
    Necrophage: string;
    Ogroid: string;
    Ooze: string;
    Plant: string;
    Specter: string;
    Vampire: string;
}
export interface AllSettings {
	alignmentsettings: AlignmentSettings,
	elementsettings: ElementSettings,
	monstersettings: MonsterSettings
}

export const DEFAULT_ALIGNMENT_SETTINGS: AlignmentSettings = {
	LG:'Lawful Good',
	NG:'Neutral Good',
	CG:'Chaotic Good',
	LN:'Lawful Neutral',
	TN:'True Neutral',
	CN:'Chaotic Neutral',
	LE:'Lawful Evil',
	NE:'Neutral Evil',
	CE:'Chaotic Evil'
};
export const DEFAULT_ELEMENT_SETTINGS: ElementSettings = {
	Air:"Air",
	Dark:'Dark',
	Death:"Death",
	Earth:"Earth",
	Fire:"Fire",
	Ice:"Ice",
	Light:"Light",
	Lightning:"Lightning",
	Life:"Life",
	Poison:"Poison",
	Water:"Water"
};
export const DEFAULT_MONSTER_SETTINGS: MonsterSettings = {
	Aberration:'Aberration',
	Beast:'Beast',
	Celestial:'Celestial',
	Construct:'Construct',
	Cursed:'Cursed',
	Draconid:'Draconid',
	Elementa:'Elementa',
	Fairy:'Fairy',
	Fiend:'Fiend',
	Hybrid:'Hybrid',
	Insectoid:'Insectoid',
	Necrophage:'Necrophage',
	Ogroid:'Ogroid',
	Ooze:'Ooze',
	Plant:'Plant',
	Specter:'Specter',
	Vampire:'Vampire'
};
export const DEFAULT_SETTINGS = {
	alignmentsettings : DEFAULT_ALIGNMENT_SETTINGS,
	elementsettings : DEFAULT_ELEMENT_SETTINGS,
	monstersettings : DEFAULT_MONSTER_SETTINGS
};

export default class MonstrologySettingsTab extends PluginSettingTab {
    plugin: Monstrology;

    constructor(app: App, plugin: Monstrology) {
        super(app, plugin);
        this.plugin = plugin;
    }

    createSetting(root: HTMLElement, key: keyof AlignmentSettings | keyof ElementSettings | keyof MonsterSettings, settings: AlignmentSettings | ElementSettings | MonsterSettings, defaultSettings: AlignmentSettings | ElementSettings | MonsterSettings, iconType: IconType, classType: string) {
        new Setting(root)
            .setName(
                createFragment(e => {
                    const flexContainer = e.createEl('div', { attr: { style: 'display: flex; align-items: center;' } });
                    ReactDOM.render(iconType[key].icon, flexContainer);
                    const spanElement = e.createSpan({text: iconType[key].value, cls: classType});
                    spanElement.style.marginLeft = '10px';
                    flexContainer.appendChild(spanElement);
                })
            )
            .addText(text => text
                .setPlaceholder(defaultSettings[key])
                .setValue(settings[key])
                .onChange(async (value) => {
                    settings[key] = value || defaultSettings[key];
                    await this.plugin.saveSettings();
                })
            )
    }
    createAlignmentSetting = (root: HTMLElement, alignmentKey: keyof AlignmentSettings) => {
        this.createSetting(root, alignmentKey, this.plugin.settings.alignmentsettings, DEFAULT_ALIGNMENT_SETTINGS, ALIGNMENT, CLASS_TYPES.ALI);
    }
    createElementSetting = (root: HTMLElement, elementKey: keyof ElementSettings) => {
        this.createSetting(root, elementKey, this.plugin.settings.elementsettings, DEFAULT_ELEMENT_SETTINGS, ELEMENT, CLASS_TYPES.ELE);
    }
    createMonsterSetting = (root: HTMLElement, monsterKey: keyof MonsterSettings) => {
        this.createSetting(root, monsterKey, this.plugin.settings.monstersettings, DEFAULT_MONSTER_SETTINGS, MONSTER, CLASS_TYPES.MON);
    }
    
    display(): void {
        const {containerEl: root} = this;
        root.empty()
    
        const displaySettingsSection = (title: string, settings: AlignmentSettings | ElementSettings | MonsterSettings, createSetting: (root: HTMLElement, key: keyof AlignmentSettings | keyof ElementSettings | keyof MonsterSettings) => void) => {
            new Setting(root)
                .setHeading()
                .setName(`${title} Types`)
                .setDesc(`The text used to identify each ${title.toLowerCase()} type.`);
    
            Object.keys(settings).forEach(key => {
                createSetting(root, key as keyof AlignmentSettings | keyof ElementSettings | keyof MonsterSettings);
            });
        }
    
        displaySettingsSection('Alignment', this.plugin.settings.alignmentsettings, this.createAlignmentSetting);
        displaySettingsSection('Element', this.plugin.settings.elementsettings, this.createElementSetting);
        displaySettingsSection('Monster', this.plugin.settings.monstersettings, this.createMonsterSetting);
    
        new Setting(root)
            .setName('Save Settings')
            .setDesc('Save the changes made to the settings.')
            .addButton((button) =>
                button.setButtonText('Save').onClick(async () => {
                    await this.plugin.saveSettings();
                    new Notice('Settings saved.');
                    this.display();
                }),
            );
    
        new Setting(root)
            .setName('Reset Settings')
            .setDesc('Reset all settings to their default values.')
            .addButton((button) =>
                button.setButtonText('Reset').onClick(async () => {
                    this.plugin.settings = {...DEFAULT_SETTINGS};
                    await this.plugin.saveSettings();
                    new Notice('Settings reset to default.');
                    this.display();
                }),
            );
    }
}