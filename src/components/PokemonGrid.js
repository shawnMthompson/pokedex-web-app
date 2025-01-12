"use client";

import { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchAndFormatAllPokemon } from "@/utils/fetchAllPokemon";
import PokemonCard from "./PokemonCard";

export default function PokemonGrid() {
  const [pokemonList, setPokemonList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 36;

  useEffect(() => {
    // Reset the state when the component mounts
    setPokemonList([]);
    setHasMore(true);
    setPage(1);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const offset = (page - 1) * limit;
      const data = await fetchAndFormatAllPokemon(limit, offset);

      // Filter out duplicates
      setPokemonList((prevList) => {
        const newList = data.filter(
          (newPokemon) =>
            !prevList.some((pokemon) => pokemon.id === newPokemon.id)
        );
        return [...prevList, ...newList];
      });

      setLoading(false);
      if (data.length === 0 || data.length < limit) {
        setHasMore(false);
      }
    };

    fetchData();
  }, [page]);

  const fetchMoreData = useCallback(() => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore]);

  return (
    <div className="container mx-auto p-4">
      {loading && page === 1 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
          {Array.from({ length: 36 }).map((_, index) => (
            <div
              key={`loader-${index}`}
              className="bg-gray-200 animate-pulse h-64 w-full rounded-lg"
            ></div>
          ))}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={pokemonList.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
              {Array.from({ length: 36 }).map((_, index) => (
                <div
                  key={`loader-${index}`}
                  className="bg-gray-200 animate-pulse h-64 w-full rounded-lg"
                ></div>
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            {pokemonList.map((pokemon, index) => (
              <PokemonCard key={`${pokemon.id}-${index}`} pokemon={pokemon} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}
