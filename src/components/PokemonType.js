import Image from "next/image";

// Single source of truth for Pokemon type badge colors.
export const TYPE_META = {
  bug: { color: "#A8B820" },
  dark: { color: "#705848" },
  dragon: { color: "#7038F8" },
  electric: { color: "#F8D030" },
  fairy: { color: "#EE99AC" },
  fighting: { color: "#C03028" },
  fire: { color: "#F08030" },
  flying: { color: "#A890F0" },
  ghost: { color: "#705898" },
  grass: { color: "#78C850" },
  ground: { color: "#E0C068" },
  ice: { color: "#98D8D8" },
  normal: { color: "#A8A878" },
  poison: { color: "#A040A0" },
  psychic: { color: "#F85888" },
  rock: { color: "#B8A038" },
  steel: { color: "#B8B8D0" },
  water: { color: "#6890F0" },
};

function formatTypeLabel(normalizedType) {
  return normalizedType
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function PokemonType({ type }) {
  // Avoid rendering when input is missing or invalid.
  if (typeof type !== "string" || type.trim().length === 0) {
    return null;
  }

  // Normalize for reliable map lookups.
  const normalizedType = type.trim().toLowerCase();
  const typeMeta = TYPE_META[normalizedType];

  // Only known Pokemon types are rendered.
  if (!typeMeta) {
    return null;
  }

  const label = formatTypeLabel(normalizedType);

  const bgColor = typeMeta.color;
  const textColor = "#FFFFFF";
  const iconPath = `/${normalizedType}.svg`;

  // Standard type chip with icon and readable label.
  return (
    <div
      className="flex justify-evenly items-center p-2 rounded w-fit space-x-3 transition-shadow hover:jiggle cursor-default"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <Image src={iconPath} alt={`${label} type icon`} height={24} width={24} />
      <p className="capitalize">{label}</p>
    </div>
  );
}
