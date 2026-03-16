const baseURL = "https://pokeapi.co/api/v2";

export async function fetchPokemon(idOrName) {
  const normalized = String(idOrName).toLowerCase();
  const response = await fetch(`${baseURL}/pokemon/${normalized}`);

  if (response.ok) {
    return await response.json();
  }

  // Some lists (notably generation species lists) contain species names that are
  // not valid pokemon endpoints. Resolve those to the default variety name.
  if (response.status === 404) {
    try {
      const speciesData = await fetchPokemonSpecies(normalized);
      const defaultVariety = speciesData.varieties?.find((v) => v.is_default);
      const fallbackName = defaultVariety?.pokemon?.name;

      if (fallbackName && fallbackName !== normalized) {
        const fallbackResponse = await fetch(`${baseURL}/pokemon/${fallbackName}`);
        if (fallbackResponse.ok) {
          console.warn(
            `[fetchPokemon] Resolved species "${normalized}" to default form "${fallbackName}"`
          );
          return await fallbackResponse.json();
        }
      }
    } catch (speciesError) {
      console.error(
        `[fetchPokemon] Failed species fallback for "${normalized}":`,
        speciesError
      );
    }
  }

  throw new Error(
    `Failed to fetch pokemon "${normalized}": ${response.status} ${response.statusText}`
  );
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
    throw error;
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
    throw fallbackError;
  }
}
