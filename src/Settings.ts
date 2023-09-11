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
    }
}