const baseURL = "https://pokeapi.co/api/v2";
const maxRetryAttempts = 3;
const baseRetryDelayMs = 250;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetryStatus(status) {
  return status === 429 || status >= 500;
}

async function fetchWithRetry(url) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetryAttempts; attempt += 1) {
    try {
      const response = await fetch(url);

      if (!shouldRetryStatus(response.status) || attempt === maxRetryAttempts) {
        return response;
      }
    } catch (error) {
      lastError = error;
      if (attempt === maxRetryAttempts) {
        throw error;
      }
    }

    await sleep(baseRetryDelayMs * attempt);
  }

  throw lastError ?? new Error(`Failed to fetch "${url}" after retries.`);
}

export async function fetchPokemon(idOrName) {
  const normalized = String(idOrName).toLowerCase();
  const response = await fetchWithRetry(`${baseURL}/pokemon/${normalized}`);

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
        const fallbackResponse = await fetchWithRetry(
          `${baseURL}/pokemon/${fallbackName}`
        );
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
  const normalized = String(idOrName).toLowerCase();

  try {
    const response = await fetchWithRetry(`${baseURL}/pokemon-species/${normalized}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch pokemon species for "${normalized}": ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    // Alternate forms (e.g. "rotom-wash") are valid pokemon names but not
    // pokemon-species names. Resolve species URL from the pokemon payload.
    try {
      const pokemonResponse = await fetchWithRetry(`${baseURL}/pokemon/${normalized}`);
      if (pokemonResponse.ok) {
        const pokemonData = await pokemonResponse.json();
        const speciesUrl = pokemonData.species?.url;

        if (speciesUrl) {
          const speciesResponse = await fetchWithRetry(speciesUrl);
          if (speciesResponse.ok) {
            console.warn(
              `[fetchPokemonSpecies] Resolved form "${normalized}" to species "${pokemonData.species.name}"`
            );
            return await speciesResponse.json();
          }
        }
      }
    } catch (speciesFallbackError) {
      console.error(
        `[fetchPokemonSpecies] Failed form -> species fallback for "${normalized}":`,
        speciesFallbackError
      );
    }

    throw error;
  }
}

export async function fetchEvolutionChain(evolutionChainUrl) {
  const response = await fetchWithRetry(evolutionChainUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch evolution chain: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}
