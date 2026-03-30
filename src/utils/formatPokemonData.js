export function formatPokemon(rawData) {
  return {
    id: rawData.id,
    name: capitalize(rawData.name),
    species_name: rawData.species.name,
    sprite: rawData.sprites.other["official-artwork"].front_default,
    types: rawData.types.map((typeInfo) => capitalize(typeInfo.type.name)),
    moves: rawData.moves,
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
    evolution_chain_url: rawData.evolution_chain?.url,
  };
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function cleanMove(move) {
  return move
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

export async function formatMoves(rawMoves) {
  const { fetchMove } = await import("./fetchPokemon.js");
  const moves = [];
  const seenMoves = new Set();
  const moveDetailsMap = {};

  // First pass: collect unique moves
  rawMoves.forEach((moveInfo) => {
    const moveName = capitalize(cleanMove(moveInfo.move.name));
    const versionDetails = moveInfo.version_group_details || [];

    versionDetails.forEach((detail) => {
      const method = detail.move_learn_method?.name || "unknown";
      const level = detail.level_learned_at || 0;

      let moveType = "other";
      if (method === "level-up") {
        moveType = "level-up";
      } else if (method === "machine") {
        moveType = "machine";
      }

      const key = `${moveName}-${moveType}-${level}`;

      if (!seenMoves.has(key)) {
        seenMoves.add(key);
        moves.push({
          name: moveName,
          moveNameLower: moveInfo.move.name,
          method: moveType,
          level: level,
        });
      }
    });
  });

  // Second pass: fetch details for each unique move
  const moveDetailPromises = moves.map(async (move) => {
    try {
      const moveData = await fetchMove(move.moveNameLower);
      moveDetailsMap[move.moveNameLower] = {
        type: moveData.type?.name || "unknown",
        power: moveData.power || null,
        accuracy: moveData.accuracy || null,
        pp: moveData.pp || null,
        damageClass: moveData.damage_class?.name || "unknown",
      };
    } catch (error) {
      console.warn(`Failed to fetch details for move "${move.moveNameLower}":`, error);
      moveDetailsMap[move.moveNameLower] = {
        type: "unknown",
        power: null,
        accuracy: null,
        pp: null,
        damageClass: "unknown",
      };
    }
  });

  await Promise.all(moveDetailPromises);

  // Third pass: enhance moves with fetched details
  return moves.map((move) => ({
    ...move,
    ...moveDetailsMap[move.moveNameLower],
  })).map((move) => {
    // Remove the temporary moveNameLower field
    const { moveNameLower, ...cleanedMove } = move;
    return cleanedMove;
  });
}
