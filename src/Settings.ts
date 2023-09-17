import { App, PluginSettingTab, Setting } from "obsidian";
import Monstrology, { MON_CLASS } from "./Main";

export interface MonstorlogySettings {
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
    Plant: string;
	Specter: string;
	Vampire: string;
}

export const DEFAULT_SETTINGS: MonstorlogySettings = {
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
    Plant: 'Plant',
	Specter: 'Specter',
	Vampire: 'Vampire'
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
                    e.createSpan({text: 'Aberration', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Aberration)
                .setValue(this.plugin.settings.Aberration)
                .onChange(async (value) => {
                    this.plugin.settings.Aberration = value || DEFAULT_SETTINGS.Aberration;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Beast', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Beast)
                .setValue(this.plugin.settings.Beast)
                .onChange(async (value) => {
                    this.plugin.settings.Beast = value || DEFAULT_SETTINGS.Beast;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Celestial', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Celestial)
                .setValue(this.plugin.settings.Celestial)
                .onChange(async (value) => {
                    this.plugin.settings.Celestial = value || DEFAULT_SETTINGS.Celestial;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Construct', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Construct)
                .setValue(this.plugin.settings.Construct)
                .onChange(async (value) => {
                    this.plugin.settings.Construct = value || DEFAULT_SETTINGS.Construct;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Cursed', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Cursed)
                .setValue(this.plugin.settings.Cursed)
                .onChange(async (value) => {
                    this.plugin.settings.Cursed = value || DEFAULT_SETTINGS.Cursed;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Draconid', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Draconid)
                .setValue(this.plugin.settings.Draconid)
                .onChange(async (value) => {
                    this.plugin.settings.Draconid = value || DEFAULT_SETTINGS.Draconid;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Elementa', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Elementa)
                .setValue(this.plugin.settings.Elementa)
                .onChange(async (value) => {
                    this.plugin.settings.Elementa = value || DEFAULT_SETTINGS.Elementa;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Fairy', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Fairy)
                .setValue(this.plugin.settings.Fairy)
                .onChange(async (value) => {
                    this.plugin.settings.Fairy = value || DEFAULT_SETTINGS.Fairy;
                    await this.plugin.saveSettings();
                })
            )        
        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Fiend', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Fiend)
                .setValue(this.plugin.settings.Fiend)
                .onChange(async (value) => {
                    this.plugin.settings.Fiend = value || DEFAULT_SETTINGS.Fiend;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Hybrid', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Hybrid)
                .setValue(this.plugin.settings.Hybrid)
                .onChange(async (value) => {
                    this.plugin.settings.Hybrid = value || DEFAULT_SETTINGS.Hybrid;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Insectoid', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Insectoid)
                .setValue(this.plugin.settings.Insectoid)
                .onChange(async (value) => {
                    this.plugin.settings.Insectoid = value || DEFAULT_SETTINGS.Insectoid;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Necrophage', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Necrophage)
                .setValue(this.plugin.settings.Necrophage)
                .onChange(async (value) => {
                    this.plugin.settings.Necrophage = value || DEFAULT_SETTINGS.Necrophage;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Ogroid', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Ogroid)
                .setValue(this.plugin.settings.Ogroid)
                .onChange(async (value) => {
                    this.plugin.settings.Ogroid = value || DEFAULT_SETTINGS.Ogroid;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Plant', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Plant)
                .setValue(this.plugin.settings.Plant)
                .onChange(async (value) => {
                    this.plugin.settings.Plant = value || DEFAULT_SETTINGS.Plant;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Specter', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Specter)
                .setValue(this.plugin.settings.Specter)
                .onChange(async (value) => {
                    this.plugin.settings.Specter = value || DEFAULT_SETTINGS.Specter;
                    await this.plugin.saveSettings();
                })
            )
        new Setting(root)
            .setName(
                createFragment(e => {
                    e.createSpan({text: 'Vampire', cls: MON_CLASS})
                })
            )
            .addText(text => text
                .setPlaceholder(DEFAULT_SETTINGS.Vampire)
                .setValue(this.plugin.settings.Vampire)
                .onChange(async (value) => {
                    this.plugin.settings.Vampire = value || DEFAULT_SETTINGS.Vampire;
                    await this.plugin.saveSettings();
                })
            )

    }
}