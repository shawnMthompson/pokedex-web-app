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

export async function fetchPokemonSpecies(idOrName) {
  try {
    // Check if the name starts with "deoxys" and remove the suffix if it does. This needs to be done as a result of inconsistencies with PokeAPI.
    const baseName = idOrName.startsWith("deoxys") ? "deoxys" : idOrName;
    const response = await fetch(`${baseURL}/pokemon-species/${baseName}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch pokemon species: ${response.statusText}`
      );
    }
    const rawData = await response.json();
    return rawData;
  } catch (error) {
    console.error(`Error fetching pokemon species: ${error}`);
    throw error;
  }
}
