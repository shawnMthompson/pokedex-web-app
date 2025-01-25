export function formatPokemon(rawData) {
  return {
    id: rawData.id,
    name: capitalizeName(rawData.name),
    sprite: rawData.sprites.other["official-artwork"].front_default,
    types: rawData.types.map((typeInfo) => capitalizeName(typeInfo.type.name)),
  };
}

function capitalizeName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
