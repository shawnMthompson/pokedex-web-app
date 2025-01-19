import { fetchAndFormatAllPokemon } from "@/utils/fetchAllPokemon";

let cachedPokemon = [];

export async function searchPokemon(query) {
  if (cachedPokemon.length === 0) {
    const limit = 1025; // All pokemon as of Jan 2025
    const offset = 0;
    cachedPokemon = await fetchAndFormatAllPokemon(limit, offset);
  }

  const lowerCaseQuery = query.toLowerCase();
  const filteredPokemon = cachedPokemon.filter((pokemon) => {
    return (
      pokemon.name.toLowerCase().includes(lowerCaseQuery) ||
      pokemon.id.toString().includes(lowerCaseQuery)
    );
  });

  return filteredPokemon.slice(0, 14); // Limit to 14 results
}
