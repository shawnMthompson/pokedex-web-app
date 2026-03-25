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
  const normalized = String(idOrName).toLowerCase();

  try {
    const response = await fetch(`${baseURL}/pokemon-species/${normalized}`);
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
      const pokemonResponse = await fetch(`${baseURL}/pokemon/${normalized}`);
      if (pokemonResponse.ok) {
        const pokemonData = await pokemonResponse.json();
        const speciesUrl = pokemonData.species?.url;

        if (speciesUrl) {
          const speciesResponse = await fetch(speciesUrl);
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
        `[fetchPokemonSpecies] Failed form->species fallback for "${normalized}":`,
        speciesFallbackError
      );
    }

    throw error;
  }
}
