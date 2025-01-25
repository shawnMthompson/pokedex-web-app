import Image from "next/image";

import BugIcon from "../../public/bug.svg";
import DarkIcon from "../../public/dark.svg";
import DragonIcon from "../../public/dragon.svg";
import ElectricIcon from "../../public/electric.svg";
import FairyIcon from "../../public/fairy.svg";
import FightingIcon from "../../public/fighting.svg";
import FireIcon from "../../public/fire.svg";
import FlyingIcon from "../../public/flying.svg";
import GhostIcon from "../../public/ghost.svg";
import GrassIcon from "../../public/grass.svg";
import GroundIcon from "../../public/ground.svg";
import IceIcon from "../../public/ice.svg";
import NormalIcon from "../../public/normal.svg";
import PoisonIcon from "../../public/poison.svg";
import PsychicIcon from "../../public/psychic.svg";
import RockIcon from "../../public/rock.svg";
import SteelIcon from "../../public/steel.svg";
import WaterIcon from "../../public/water.svg";

const typeIcons = [
  { name: "bug", icon: BugIcon },
  { name: "dark", icon: DarkIcon },
  { name: "dragon", icon: DragonIcon },
  { name: "electric", icon: ElectricIcon },
  { name: "fairy", icon: FairyIcon },
  { name: "fighting", icon: FightingIcon },
  { name: "fire", icon: FireIcon },
  { name: "flying", icon: FlyingIcon },
  { name: "ghost", icon: GhostIcon },
  { name: "grass", icon: GrassIcon },
  { name: "ground", icon: GroundIcon },
  { name: "ice", icon: IceIcon },
  { name: "normal", icon: NormalIcon },
  { name: "poison", icon: PoisonIcon },
  { name: "psychic", icon: PsychicIcon },
  { name: "rock", icon: RockIcon },
  { name: "steel", icon: SteelIcon },
  { name: "water", icon: WaterIcon },
];

const typeColors = {
  bug: "#A8B820",
  dark: "#705848",
  dragon: "#7038F8",
  electric: "#F8D030",
  fairy: "#EE99AC",
  fighting: "#C03028",
  fire: "#F08030",
  flying: "#A890F0",
  ghost: "#705898",
  grass: "#78C850",
  ground: "#E0C068",
  ice: "#98D8D8",
  normal: "#A8A878",
  poison: "#A040A0",
  psychic: "#F85888",
  rock: "#B8A038",
  steel: "#B8B8D0",
  water: "#6890F0",
};

export default function PokemonType({ type }) {
  const normalizedType = type.toLowerCase();
  const typeData = typeIcons.find((t) => t.name === normalizedType);

  if (!typeData) {
    return null;
  }

  const bgColor = typeColors[normalizedType] || "#FFFFFF";

  return (
    <div
      className="flex justify-evenly items-center p-2 rounded w-fit space-x-3 transition-shadow hover:jiggle cursor-default"
      style={{ backgroundColor: bgColor }}
    >
      <Image src={typeData.icon} alt={`${type} icon`} height={24} width={24} />
      <p className="capitalize contrast-100">{type}</p>
    </div>
  );
}
