import { fetchAndFormatAllPokemon } from "@/utils/fetchAllPokemon";
import PokemonCard from "./PokemonCard";

// More responsive work needs to be done here still.

export default async function PokemonGrid() {
  const pokemonList = await fetchAndFormatAllPokemon(18);

  return (
    <div className="container mx-auto p-4 flex">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {pokemonList.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} /> // Create PokemonCard components with individual pokemon props
        ))}
      </div>
    </div>
  );
}
