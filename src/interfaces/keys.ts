export type AlignmentKeys = keyof import("./AlignmentSettings").AlignmentSettings;
export type ElementKeys = keyof import("./ElementSettings").ElementSettings;
export type MonsterKeys = keyof import("./MonsterSettings").MonsterSettings;

export type AllKeys = AlignmentKeys | ElementKeys | MonsterKeys;