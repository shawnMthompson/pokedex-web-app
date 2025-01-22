import { formatPokemon } from "@/utils/formatData";
import { fetchPokemon } from "@/utils/fetchPokemon";

const baseURL = "https://pokeapi.co/api/v2";
const MAX_POKEMON_ID = 1024;

// Fetch a list of pokemon with basic information (their names)
export async function fetchAllPokemon(limit, offset) {
  const response = await fetch(
    `${baseURL}/pokemon?limit=${limit}&offset=${offset}`
  );
  const data = await response.json();
  return data.results;
}

// Fetches detailed information of pokemon in the list and formats it
export async function fetchAndFormatAllPokemon(limit, offset) {
  const pokemonList = await fetchAllPokemon(limit, offset);

  const formattedPokemonList = await Promise.all(
    pokemonList.map(async (pokemon) => {
      const rawData = await fetchPokemon(pokemon.name);
      const formattedData = formatPokemon(rawData);
      return formattedData;
    })
  );

  return formattedPokemonList.filter((pokemon) => pokemon.id <= MAX_POKEMON_ID);
}
