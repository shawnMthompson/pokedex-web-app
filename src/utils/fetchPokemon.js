const baseURL = "https://pokeapi.co/api/v2";

export async function fetchPokemon(idOrName) {
  try {
    const response = await fetch(`${baseURL}/pokemon/${idOrName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch pokemon: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching pokemon: ${error}`);
    throw error;
  }
}

export async function fetchPokemonSpecies(idOrName) {
  try {
    const response = await fetch(`${baseURL}/pokemon-species/${idOrName}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch pokemon species for "${idOrName}": ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    if (idOrName.startsWith("deoxys")) {
      console.log("Re-handling Deoxys Fetch");
      return await fetchDeoxysFallback();
    }
  }
}

async function fetchDeoxysFallback() {
  try {
    const fallbackResponse = await fetch(`${baseURL}/pokemon-species/deoxys`);
    if (!fallbackResponse.ok) {
      throw new Error(
        `Failed to fetch fallback species for "deoxys": ${fallbackResponse.statusText}`
      );
    }
    return await fallbackResponse.json();
  } catch (fallbackError) {
    console.error(
      `Error fetching fallback species for "deoxys": ${fallbackError.message}`
    );
    throw error;
  }
}
