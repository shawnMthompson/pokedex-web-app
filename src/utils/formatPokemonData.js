export function formatPokemon(rawData) {
  return {
    id: rawData.id,
    name: capitalize(rawData.name),
    sprite: rawData.sprites.other["official-artwork"].front_default,
    types: rawData.types.map((typeInfo) => capitalize(typeInfo.type.name)),
    height: rawData.height,
    weight: rawData.weight,
    abilities: rawData.abilities.map((abilityInfo) => {
      const abilityName = capitalize(abilityInfo.ability.name);
      return abilityInfo.is_hidden
        ? `${abilityName} (Hidden Ability)`
        : abilityName;
    }),
    hp: rawData.stats[0].base_stat,
    attack: rawData.stats[1].base_stat,
    defense: rawData.stats[2].base_stat,
    special_attack: rawData.stats[3].base_stat,
    special_defense: rawData.stats[4].base_stat,
    speed: rawData.stats[5].base_stat,
    total: rawData.stats.reduce((acc, stat) => acc + stat.base_stat, 0),
  };
}

export function formatPokemonSpecies(rawData) {
  return {
    color: capitalize(rawData.color.name),
    description: getEnglishDescription(rawData.flavor_text_entries),
    generation: formatGeneration(rawData.generation.name),
    category: getEnglishGenus(rawData.genera),
  };
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function cleanDescription(description) {
  return description
    .replace(/\n/g, " ")
    .replace(/\u000c/g, " ")
    .replace(".", ". ");
}

function getEnglishDescription(flavorTextEntries) {
  const englishEntry = flavorTextEntries.find(
    (entry) => entry.language.name === "en"
  );
  return englishEntry ? cleanDescription(englishEntry.flavor_text) : "";
}

function getEnglishGenus(genera) {
  const englishGenus = genera.find((genus) => genus.language.name === "en");
  return englishGenus ? englishGenus.genus : "";
}

function formatGeneration(generation) {
  const generationMapping = {
    "generation-i": "Generation I",
    "generation-ii": "Generation II",
    "generation-iii": "Generation III",
    "generation-iv": "Generation IV",
    "generation-v": "Generation V",
    "generation-vi": "Generation VI",
    "generation-vii": "Generation VII",
    "generation-viii": "Generation VIII",
    "generation-ix": "Generation IX",
  };
  return generationMapping[generation.toLowerCase()];
}
