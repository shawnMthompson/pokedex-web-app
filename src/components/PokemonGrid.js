import { fetchAndFormatAllPokemon } from "@/utils/fetchAllPokemon"; 
import PokemonCard from "./PokemonCard";

export default async function PokemonGrid() {
    const pokemonList = await fetchAndFormatAllPokemon(151);

    return (
        <div className="grid grid-cols-6">
            {pokemonList.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />  // Create PokemonCard components with individual pokemon props
            ))}
        </div>
    );
}