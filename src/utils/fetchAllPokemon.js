import { formatPokemon } from '@/utils/formatData';

const baseURL = "https://pokeapi.co/api/v2";
export async function fetchAllPokemon(limit) {
    const response = await fetch(`${baseURL}/pokemon?limit=${limit}`);
    const data = await response.json();
    return data.results;
}

export async function fetchAndFormatAllPokemon(limit) {
    const pokemonList = await fetchAllPokemon(limit)

    const formattedPokemonList = await Promise.all(
        pokemonList.map(async (pokemon) => {
            const response = await fetch(`${baseURL}/pokemon/${pokemon.name}`);
            const rawData = await response.json();
            const formattedData = formatPokemon(rawData);
            return formattedData;
        })
    );

    return formattedPokemonList;
}
