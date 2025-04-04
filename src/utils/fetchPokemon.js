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

/**
 *  In hindsight, it doesn't make a whole lot of sense to check for a pokemon with "deoxys" as the starting characters all the time.
 *  I will modify this the next time I start actively working on this project to only handle it when the error gets thrown for deoxys .
 *  (as it did prior to my current solution.)
 * 
 * Plan: Refactor to handle this case ONLY when an error occurs for "deoxys"
 */

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
