import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import Monstrology from "./Main";

import * as ReactDOM from "react-dom";
import { ALIGNMENT, ELEMENT, MONSTER, CLASS_TYPES } from "./constant";
import { IconType } from "./types";

import { AllSettings } from "./interfaces/AllSettings";
import { DEFAULT_SETTINGS } from "./constants/defaults";



export default class MonstrologySettingsTab extends PluginSettingTab {
    plugin: Monstrology;

    constructor(app: App, plugin: Monstrology) {
        super(app, plugin);
        this.plugin = plugin;
    }

    private createSetting<T extends Record<string, string>>(
        root: HTMLElement,
        key: keyof T,
        settings: T,
        defaultSettings: T, 
        iconType: IconType,
        classType: string
    ) {
        new Setting(root)
            .setName(
                createFragment(e => {
                    const flexContainer = e.createEl('div', {
                        attr: { style: 'display: flex; align-items: center;' },
                    });
                    ReactDOM.render(iconType[key as string], flexContainer);

                    const spanElement = e.createSpan({
                        text: key as string, 
                        cls: classType
                    });
                    spanElement.style.marginLeft = '10px';
                    flexContainer.appendChild(spanElement);
                })
            )
            .addText(text => text
                .setPlaceholder(defaultSettings[key])
                .setValue(settings[key])
                .onChange(async (value) => {
                    settings[key] = (value || defaultSettings[key]) as T[keyof T];
                    await this.plugin.saveSettings();
                })
            );
    }

    private displaySettingsSection<T extends Record<string, string>>(
        root: HTMLElement,
        title: string,
        settings: T,
        defaults: T,
        iconType: IconType,
        classType: string
    ) {
        new Setting(root)
            .setHeading()
            .setName(`${title} Types`)
            .setDesc(`The text used to identify each ${title.toLowerCase()} type.`);

        Object.keys(settings).forEach(key => {
            this.createSetting(root, key as keyof T, settings, defaults, iconType, classType);
        });
    }
    
    display(): void {
        const {containerEl: root} = this;
        root.empty()
    
        this.displaySettingsSection(
            root,
            'Alignment', 
            this.plugin.settings.alignmentsettings,
            DEFAULT_SETTINGS.alignmentsettings,
            ALIGNMENT,
            CLASS_TYPES.ALI
        );

        this.displaySettingsSection(
            root,
            'Element',
            this.plugin.settings.elementsettings,
            DEFAULT_SETTINGS.elementsettings,
            ELEMENT,
            CLASS_TYPES.ELE
        );

        this.displaySettingsSection(
            root,
            'Monster',
            this.plugin.settings.monstersettings,
            DEFAULT_SETTINGS.monstersettings,
            MONSTER,
            CLASS_TYPES.MON
        );
    
        new Setting(root)
            .setName('Save Settings')
            .setDesc('Save the changes made to the settings.')
            .addButton((button) =>
                button.setButtonText('Save').onClick(async () => {
                    await this.plugin.saveSettings();
                    await this.plugin.loadSettings();
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
                    await this.plugin.loadSettings();
                    new Notice('Settings reset to default.');
                    this.display();
                }),
            );
    }
}