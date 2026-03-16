import { formatPokemon } from "@/utils/formatPokemonData";
import { fetchPokemon } from "@/utils/fetchPokemon";

const baseURL = "https://pokeapi.co/api/v2";
export const MAX_POKEMON_ID = 1025;

// Fetch a page of pokemon names via offset-based pagination
export async function fetchAllPokemon(limit, offset) {
  const response = await fetch(
    `${baseURL}/pokemon?limit=${limit}&offset=${offset}`
  );
  const data = await response.json();
  return data.results;
}

// Fetch all pokemon names belonging to a given type (e.g. "fire")
export async function fetchPokemonNamesByType(type) {
  const response = await fetch(`${baseURL}/type/${type.toLowerCase()}`);
  const data = await response.json();
  return data.pokemon.map((entry) => entry.pokemon.name);
}

// Fetch all pokemon names belonging to a given generation (e.g. "generation-i"), sorted by ID
export async function fetchPokemonNamesByGeneration(generation) {
  const response = await fetch(
    `${baseURL}/generation/${generation.toLowerCase()}`
  );
  const data = await response.json();
  return data.pokemon_species
    .sort((a, b) => {
      const idFromUrl = (url) => parseInt(url.split("/").filter(Boolean).pop());
      return idFromUrl(a.url) - idFromUrl(b.url);
    })
    .map((species) => species.name);
}

// Fetch, format, and filter a list of pokemon by name.
// Uses Promise.allSettled so a single failed fetch doesn't break the whole batch.
export async function fetchAndFormatPokemonByNames(names) {
  const results = await Promise.allSettled(
    names.map(async (name) => {
      const rawData = await fetchPokemon(name);
      return formatPokemon(rawData);
    })
  );

  return results.flatMap((result, i) => {
    if (result.status === "rejected") {
      console.error(
        `[fetchAndFormatPokemonByNames] Failed to fetch "${names[i]}":`,
        result.reason
      );
      return [];
    }
    return result.value.id <= MAX_POKEMON_ID ? [result.value] : [];
  });
}

// Fetch and format a paginated slice of all pokemon

// Fetch and format a paginated slice of all pokemon
export async function fetchAndFormatAllPokemon(limit, offset) {
  const pokemonList = await fetchAllPokemon(limit, offset);
  return fetchAndFormatPokemonByNames(pokemonList.map((p) => p.name));
}
