import { formatPokemon } from "@/utils/formatData";
import { fetchPokemon } from "@/utils/fetchPokemon";

const baseURL = "https://pokeapi.co/api/v2";

// Fetch a list of pokemon with basic information (their names)
export async function fetchAllPokemon(limit) {
  const response = await fetch(`${baseURL}/pokemon?limit=${limit}`);
  const data = await response.json();
  return data.results;
}

// Fetches detailed information of pokemon in the list and formats it
export async function fetchAndFormatAllPokemon(limit) {
  const pokemonList = await fetchAllPokemon(limit);

  const formattedPokemonList = await Promise.all(
    pokemonList.map(async (pokemon) => {
      const rawData = await fetchPokemon(pokemon.name);
      const formattedData = formatPokemon(rawData);
      return formattedData;
    })
  );

  return formattedPokemonList;
}
