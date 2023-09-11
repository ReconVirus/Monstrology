import { App, PluginSettingTab, Setting } from "obsidian";
import Monstrology, { MON_CLASS } from "./Main";

export interface MonstorlogySettings {
    BeastString: string;
	CursedString: string;
	DraconidString: string;
	ElementaString: string;
	HybridString: string;
	InsectoidString: string;
	NecrophageString: string;
	OgroidString: string;
	SpecterString: string;
	VampireString: string;
}

export const DEFAULT_SETTINGS: MonstorlogySettings = {
    BeastString: 'Beast',
	CursedString: 'Cursed',
	DraconidString: 'Draconid',
	ElementaString: 'Elementa',
	HybridString: 'Hybrid',
	InsectoidString: 'Insectoid',
	NecrophageString: 'Necrophage',
	OgroidString: 'Ogroid',
	SpecterString: 'Specter',
	VampireString: 'Vampire'
}

export default class MonstrologySettingsTab extends PluginSettingTab {
    plugin: Monstrology;

    constructor(app: App, plugin: Monstrology) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl: root} = this;
        root.empty()

        new Setting(root)
            .setHeading()
            .setName('Monster Types')
            .setDesc('The text used to identify each monster type.')

        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Beast', cls: MON_CLASS})
                    e.createSpan({text: 'Beast'})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.BeastString)
                .setValue(this.plugin.settings.BeastString)
                .onChange(async (value) => {
                    this.plugin.settings.BeastString = value || DEFAULT_SETTINGS.BeastString;
                    await this.plugin.saveSettings();
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.CursedString)
                .setValue(this.plugin.settings.CursedString)
                .onChange(async (value) => {
                    this.plugin.settings.CursedString = value || DEFAULT_SETTINGS.CursedString;
                    await this.plugin.saveSettings();
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.DraconidString)
                .setValue(this.plugin.settings.DraconidString)
                .onChange(async (value) => {
                    this.plugin.settings.DraconidString = value || DEFAULT_SETTINGS.DraconidString;
                    await this.plugin.saveSettings();
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.ElementaString)
                .setValue(this.plugin.settings.ElementaString)
                .onChange(async (value) => {
                    this.plugin.settings.ElementaString = value || DEFAULT_SETTINGS.ElementaString;
                    await this.plugin.saveSettings();
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.HybridString)
                .setValue(this.plugin.settings.HybridString)
                .onChange(async (value) => {
                    this.plugin.settings.HybridString = value || DEFAULT_SETTINGS.HybridString;
                    await this.plugin.saveSettings();
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.InsectoidString)
                .setValue(this.plugin.settings.InsectoidString)
                .onChange(async (value) => {
                    this.plugin.settings.InsectoidString = value || DEFAULT_SETTINGS.InsectoidString;
                    await this.plugin.saveSettings();
                })
            )
    }
}