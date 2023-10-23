import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import Monstrology, { ALIGNMENT, ALI_CLASS, ELEMENT, ELE_CLASS, MONSTER, MON_CLASS } from "./Main";
import * as ReactDOM from "react-dom";

export const DEFAULT_ALIGNMENT_SETTINGS: AlignmentSettings = {
	LG: 'Lawful Good',
	NG: 'Neutral Good',
	CG: 'Chaotic Good',
	LN: 'Lawful Neutral',
	TN: 'True Neutral',
	CN: 'Chaotic Neutral',
	LE: 'Lawful Evil',
	NE: 'Neutral Evil',
	CE: 'Chaotic Evil',
}
export const DEFAULT_ELEMENT_SETTINGS: ElementSettings = {
	Air: "Air",
	Dark: 'Dark',
	Death: "Death",
	Earth: "Earth",
	Fire: "Fire",
    Ice: "Ice",
	Light: "Light",
	Lightning: "Lightning",
	Life: "Life",
    Poison: "Poison",
	Water: "Water"
}
export const DEFAULT_MONSTER_SETTINGS: MonsterSettings = {
    Aberration: 'Aberration',
    Beast: 'Beast',
    Celestial: 'Celestial',
    Construct: 'Construct',
	Cursed: 'Cursed',
	Draconid: 'Draconid',
	Elementa: 'Elementa',
    Fairy: 'Fairy',
    Fiend: 'Fiend',
	Hybrid: 'Hybrid',
	Insectoid: 'Insectoid',
	Necrophage: 'Necrophage',
	Ogroid: 'Ogroid',
    Ooze: 'Ooze',
    Plant: 'Plant',
	Specter: 'Specter',
	Vampire: 'Vampire'
}
export const DEFAULT_SETTINGS = {
    ...DEFAULT_ALIGNMENT_SETTINGS,
    ...DEFAULT_ELEMENT_SETTINGS,
    ...DEFAULT_MONSTER_SETTINGS
}
export interface AlignmentSettings{
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

export default class MonstrologySettingsTab extends PluginSettingTab {
    plugin: Monstrology;

    constructor(app: App, plugin: Monstrology) {
        super(app, plugin);
        this.plugin = plugin;
    }

    createAlignmentSetting(root: HTMLElement, alignmentKey: keyof AlignmentSettings) {
        new Setting(root)
            .setName(
                createFragment(e => {
                    const flexContainer = e.createEl('div', { attr: { style: 'display: flex; align-items: center;' } });
                    ReactDOM.render(ALIGNMENT[alignmentKey].icon, flexContainer);
                    const spanElement = e.createSpan({text: ALIGNMENT[alignmentKey].value, cls: ALI_CLASS});
                    spanElement.style.marginLeft = '10px';
                    flexContainer.appendChild(spanElement);
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_ALIGNMENT_SETTINGS[alignmentKey])
                .setValue(this.plugin.settings[alignmentKey])
                .onChange(async (value) => {
                    this.plugin.settings[alignmentKey] = value || DEFAULT_ALIGNMENT_SETTINGS[alignmentKey];
                    await this.plugin.saveSettings();
                })
            )
    }

    createElementSetting(root: HTMLElement, elementKey: keyof ElementSettings) {
        new Setting(root)
            .setName(
                createFragment(e => {
                    const flexContainer = e.createEl('div', { attr: { style: 'display: flex; align-items: center;' } });
                    ReactDOM.render(ELEMENT[elementKey].icon, flexContainer);
                    const spanElement = e.createSpan({text: ELEMENT[elementKey].value, cls: ELE_CLASS});
                    spanElement.style.marginLeft = '10px';
                    flexContainer.appendChild(spanElement);
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_ELEMENT_SETTINGS[elementKey])
                .setValue(this.plugin.settings[elementKey])
                .onChange(async (value) => {
                    this.plugin.settings[elementKey] = value || DEFAULT_ELEMENT_SETTINGS[elementKey];
                    await this.plugin.saveSettings();
                })
            )
    }

    createMonsterSetting(root: HTMLElement, monsterKey: keyof MonsterSettings) {
        new Setting(root)
            .setName(
                createFragment(e => {
                    const flexContainer = e.createEl('div', { attr: { style: 'display: flex; align-items: center;' } });
                    ReactDOM.render(MONSTER[monsterKey].icon, flexContainer);
                    const spanElement = e.createSpan({text: MONSTER[monsterKey].value, cls: MON_CLASS});
                    spanElement.style.marginLeft = '10px';
                    flexContainer.appendChild(spanElement);
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_MONSTER_SETTINGS[monsterKey])
                .setValue(this.plugin.settings[monsterKey])
                .onChange(async (value) => {
                    this.plugin.settings[monsterKey] = value || DEFAULT_MONSTER_SETTINGS[monsterKey];
                    await this.plugin.saveSettings();
                })
            )
    }

    display(): void {
        const {containerEl: root} = this;
        root.empty()

        new Setting(root)
            .setHeading()
            .setName('Alignment Types')
            .setDesc('The text used to identify each aligment type.')

            Object.keys(ALIGNMENT).forEach(aligmentKey => {
                this.createAlignmentSetting(root, aligmentKey as keyof AlignmentSettings);
            });

        new Setting(root)
            .setHeading()
            .setName('Element Types')
            .setDesc('The text used to identify each element type.')

            Object.keys(ELEMENT).forEach(elementKey => {
                this.createElementSetting(root, elementKey as keyof ElementSettings)
            });

        new Setting(root)
            .setHeading()
            .setName('Monster Types')
            .setDesc('The text used to identify each monster type.')

            Object.keys(MONSTER).forEach(monsterKey => {
                this.createMonsterSetting(root, monsterKey as keyof MonsterSettings)
            });

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