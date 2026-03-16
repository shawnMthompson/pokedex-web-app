"use client";

import InfiniteScroll from "react-infinite-scroll-component";
import { usePokemonPagination } from "@/hooks/usePokemonPagination";
import PokemonCard from "./PokemonCard";

const GRID_CLASSES =
  "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4";

function SkeletonGrid() {
  return (
    <div className={GRID_CLASSES}>
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="bg-gray-200 animate-pulse h-64 w-full rounded-lg" />
      ))}
    </div>
  );
}

/**
 * Renders a paginated, infinitely-scrolling grid of Pokemon cards.
 *
 * @param {Object|null} filter - Optional filter: { type: "fire" } or { generation: "generation-i" }
 */
export default function PokemonGrid({ filter = null }) {
  const { pokemonList, hasMore, loading, error, fetchMore } =
    usePokemonPagination(filter);

  if (error && pokemonList.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        Failed to load Pokémon. Please try refreshing the page.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {loading && pokemonList.length === 0 ? (
        <SkeletonGrid />
      ) : (
        <InfiniteScroll
          dataLength={pokemonList.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={<SkeletonGrid />}
        >
          <div className={GRID_CLASSES}>
            {pokemonList.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}

