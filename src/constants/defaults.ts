import { AllSettings } from "src/interfaces/AllSettings";
import { DEFAULT_ALIGNMENT_SETTINGS } from "./defaults/alignmentDefaults";
import { DEFAULT_ELEMENT_SETTINGS } from "./defaults/elementsDefaults";
import { DEFAULT_MONSTER_SETTINGS } from "./defaults/monsterDefaults";
import { DEFAULT_ICONS } from "./icon";

export const DEFAULT_SETTINGS: AllSettings = {
    alignmentsettings: DEFAULT_ALIGNMENT_SETTINGS,
    elementsettings: DEFAULT_ELEMENT_SETTINGS,
    monstersettings: DEFAULT_MONSTER_SETTINGS,
    iconsettings: DEFAULT_ICONS,
};