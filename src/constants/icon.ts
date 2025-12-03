import { BsFillLightningFill } from "react-icons/bs";
import {
	GiAlienStare,
	GiAngelOutfit,
	GiAngelWings,
	GiArchitectMask,
	GiBatwingEmblem,
	GiBrute,
	GiButterfly,
	GiCrownedSkull,
	GiCursedStar,
	GiDeathSkull,
	GiDesertSkull,
	GiFist,
	GiFlatPawPrint,
	GiHood,
	GiImpLaugh,
	GiLifeSupport,
	GiMaggot,
	GiMoon,
	GiMuscleUp,
	GiPoisonBottle,
	GiScales,
	GiSlime,
	GiStoneSphere,
	GiStoneTower,
	GiSun,
	GiTombstone,
	GiTwoFeathers,
	GiWaterSplash,
	GiWhirlwind,
} from "react-icons/gi";
import {
	FaDragon,
	FaHandHoldingHeart,
	FaRegCircle,
	FaRegSnowflake,
} from "react-icons/fa6";
import { ImFire } from "react-icons/im";
import { PiPlantFill } from "react-icons/pi";
import { SiElement } from "react-icons/si";
import { generateIcon } from "src/IconUtils";
import { IconSettings } from "src/interfaces/IconSettings";

export const DEFAULT_ALIGNMENT_ICONS: IconSettings = {
    LG: generateIcon(GiAngelWings, "lightgoldenrodyellow"),
    NG: generateIcon(FaHandHoldingHeart, "pink"),
    CG: generateIcon(GiFist, "dodgerblue"),
    LN: generateIcon(GiScales, "goldenrod"),
    TN: generateIcon(FaRegCircle, "white"),
    CN: generateIcon(GiTwoFeathers, "mediumseagreen"),
    LE: generateIcon(GiCrownedSkull, "orangered"),
    NE: generateIcon(GiImpLaugh, "red"),
    CE: generateIcon(GiBrute, "rebeccapurple"),
};

export const DEFAULT_ELEMENT_ICONS: IconSettings = {
    Air: generateIcon(GiWhirlwind, "white"),
    Dark: generateIcon(GiMoon, "dimgray"),
    Death: generateIcon(GiDeathSkull, "gainsboro"),
    Earth: generateIcon(GiStoneSphere, "darkgoldenrod"),
    Fire: generateIcon(ImFire, "red"),
    Ice: generateIcon(FaRegSnowflake, "lightcyan"),
    Light: generateIcon(GiSun, "lightgoldenrodyellow"),
    Lightning: generateIcon(BsFillLightningFill, "lightblue"),
    Life: generateIcon(GiLifeSupport, "hotpink"),
    Poison: generateIcon(GiPoisonBottle, "lawngreen"),
    Water:generateIcon(GiWaterSplash, "aqua"),
};

export const DEFAULT_MONSTER_ICONS: IconSettings = {
    Aberration: generateIcon(GiAlienStare, "darkgray"),
    Beast: generateIcon(GiFlatPawPrint, "rebeccapurple"),
    Celestial: generateIcon(GiAngelOutfit, "ivory"),
    Construct: generateIcon(GiStoneTower, "lightgray"),
    Cursed: generateIcon(GiCursedStar, "lightslategray"),
    Draconid: generateIcon(FaDragon, "mediumslateblue"),
    Elementa: generateIcon(SiElement, "lightblue"),
    Fairy:generateIcon(GiButterfly, "orchid"),
    Fiend: generateIcon(GiDesertSkull, "darkred"),
    Hybrid: generateIcon(GiArchitectMask, "palegoldenrod"),
    Insectoid: generateIcon(GiMaggot, "yellowgreen"),
    Necrophage: generateIcon(GiTombstone, "gray"),
    Ogroid: generateIcon(GiMuscleUp, "orange"),
    Ooze: generateIcon(GiSlime, "lightskyblue"),
    Plant: generateIcon(PiPlantFill, "limegreen"),
    Specter: generateIcon(GiHood, "ghostwhite"),
    Vampire: generateIcon(GiBatwingEmblem, "crimson"),
};

export const DEFAULT_ICONS: IconSettings = {
  ...DEFAULT_ALIGNMENT_ICONS,
  ...DEFAULT_ELEMENT_ICONS,
  ...DEFAULT_MONSTER_ICONS,
};
