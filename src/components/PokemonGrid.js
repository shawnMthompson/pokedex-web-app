import { fetchAndFormatAllPokemon } from "@/utils/fetchAllPokemon";
import PokemonCard from "./PokemonCard";

// More responsive work needs to be done here still.

export default async function PokemonGrid() {
  const pokemonList = await fetchAndFormatAllPokemon(18);

  return (
    <container className="flex w-2/3 mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {pokemonList.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} /> // Create PokemonCard components with individual pokemon props
        ))}
      </div>
    </container>
  );
}
