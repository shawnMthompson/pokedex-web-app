const baseURL = "https://pokeapi.co/api/v2";

export async function fetchPokemon(idOrName) {
  try {
    const response = await fetch(`${baseURL}/pokemon/${idOrName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch pokemon: ${response.statusText}`);
    }
    const rawData = await response.json();
    return rawData;
  } catch (error) {
    console.error(`Error fetching pokemon: ${error}`);
    throw error;
  }
}
