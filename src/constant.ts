import { DEFAULT_SETTINGS } from './constants/defaults';
import { IconType, TriggerType } from './types';


export const CLASS_TYPES = {
	ALI: "AlignmentType",
	ELE: "ElementType",
	MON: "MonsterType"
};

export const generateIcons = (settings: Record<string, string>): IconType => {
	return Object.keys(settings).reduce((icons, key) => {
		const icon = DEFAULT_SETTINGS.iconsettings[key];
		return { ...icons, [key]: icon };
	}, {} as IconType);
};

export const ALIGNMENT = generateIcons(DEFAULT_SETTINGS.alignmentsettings);
export const ELEMENT = generateIcons(DEFAULT_SETTINGS.elementsettings);
export const MONSTER = generateIcons(DEFAULT_SETTINGS.monstersettings);

export const TRIGGER_TYPES: Record<TriggerType, IconType> = {
	[TriggerType.Ali]: ALIGNMENT,
	[TriggerType.Ele]: ELEMENT,
	[TriggerType.Mon]: MONSTER
};