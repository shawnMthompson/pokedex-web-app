export function formatPokemon(rawData) {
  return {
    id: rawData.id,
    name: capitalizeName(rawData.name),
    sprite: rawData.sprites.other["official-artwork"].front_default,
    types: rawData.types.map((typeInfo) => capitalizeName(typeInfo.type.name)),
  };
}

export function formatPokemonSpecies(rawData) {
  return {
    color: capitalizeName(rawData.color.name),
    description: cleanName(rawData.flavor_text_entries[1].flavor_text),
  };
}

function capitalizeName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function cleanName(name) {
  return name
    .replace(/\n/g, " ")
    .replace(/\u000c/g, " ")
    .replace(".", ". ");
}
