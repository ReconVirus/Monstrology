import { IconSettings } from "./IconSettings";
import { AlignmentSettings } from "./AlignmentSettings";
import { ElementSettings } from "./ElementSettings";
import { MonsterSettings } from "./MonsterSettings";

export interface AllSettings {
    [key: string]: any;
    alignmentsettings: AlignmentSettings,
    elementsettings: ElementSettings,
    monstersettings: MonsterSettings,
    iconsettings: IconSettings
}
