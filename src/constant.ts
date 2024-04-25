import { IconType, TriggerType } from './types';
import { DEFAULT_SETTINGS } from './Settings';

export const CLASS_TYPES = {
	ALI: "AlignmentType",
	ELE: "ElementType",
	MON: "MonsterType"
};

export const generateIcons = (settings: Record<string, string>): IconType => {
	return Object.keys(settings).reduce((icons, key) => {
		const name = settings[key];
		const icon = DEFAULT_SETTINGS.iconsettings[key];
		return { ...icons, [key]: { value: name, icon } };
	}, {});
};

export const ALIGNMENT = generateIcons(DEFAULT_SETTINGS.alignmentsettings);
export const ELEMENT = generateIcons(DEFAULT_SETTINGS.elementsettings);
export const MONSTER = generateIcons(DEFAULT_SETTINGS.monstersettings);

export const TRIGGER_TYPES: Record<TriggerType, IconType> = {
	[TriggerType.Ali]: ALIGNMENT,
	[TriggerType.Ele]: ELEMENT,
	[TriggerType.Mon]: MONSTER
};