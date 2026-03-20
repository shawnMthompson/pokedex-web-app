const baseURL = "https://pokeapi.co/api/v2";
const MAX_RESULTS = 14;
let pokemonIndexPromise = null;

function parseIdFromPokemonUrl(url) {
  return parseInt(url.split("/").filter(Boolean).pop(), 10);
}

function getArtworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

async function getPokemonIndex() {
  if (!pokemonIndexPromise) {
    pokemonIndexPromise = fetch(`${baseURL}/pokemon?limit=2000&offset=0`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch pokemon index: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        return data.results.map((pokemon) => {
          const id = parseIdFromPokemonUrl(pokemon.url);
          return {
            id,
            name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
            sprite: getArtworkUrl(id),
          };
        });
      })
      .catch((error) => {
        pokemonIndexPromise = null;
        throw error;
      });
  }

  return pokemonIndexPromise;
}

export async function getDefaultPokemonSuggestions() {
  const pokemonIndex = await getPokemonIndex();
  return pokemonIndex.slice(0, MAX_RESULTS);
}

export async function searchPokemon(query) {
  const pokemonIndex = await getPokemonIndex();
  const lowerCaseQuery = query.trim().toLowerCase();

  if (!lowerCaseQuery) {
    return pokemonIndex.slice(0, MAX_RESULTS);
  }

  return pokemonIndex
    .filter((pokemon) => {
      return (
        pokemon.name.toLowerCase().includes(lowerCaseQuery) ||
        pokemon.id.toString().includes(lowerCaseQuery)
      );
    })
    .slice(0, MAX_RESULTS);
}
