"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { debounce } from "lodash";
import { searchPokemon, getDefaultPokemonSuggestions } from "@/utils/searchQuery";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SearchBar() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const latestRequestRef = useRef(0);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (nextQuery, focused) => {
        const requestId = ++latestRequestRef.current;

        try {
          if (!focused) {
            if (requestId === latestRequestRef.current) {
              setResults([]);
            }
            return;
          }

          const searchResults = nextQuery.trim()
            ? await searchPokemon(nextQuery)
            : await getDefaultPokemonSuggestions();

          if (requestId === latestRequestRef.current) {
            setResults(searchResults);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
          if (requestId === latestRequestRef.current) {
            setResults([]);
          }
        }
      }, 150),
    []
  );

  useEffect(() => {
    debouncedSearch(query, isFocused);

    return () => {
      debouncedSearch.cancel();
    };
  }, [query, isFocused, debouncedSearch]);

  const handleEnterKey = (e) => {
    if (e.key === "Enter" && query) {
      const selectedPokemon = results.find(
        (pokemon) => pokemon.name.toLowerCase() === query.toLowerCase()
      );
      if (selectedPokemon) {
        router.push(`/pokemon/${selectedPokemon.name.toLowerCase()}`);
      }
    }
  };

  const handleClick = (pokemon) => {
    setTimeout(() => {
      router.push(`/pokemon/${pokemon.name.toLowerCase()}`);
    }, 100);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsFocused(false);
      setQuery("");
      setResults([]);
    }
  };

  return (
    <div className="flex flex-wrap justify-center p-2 md:p-4">
      <div
        className="relative flex flex-col w-full max-w-md"
        onBlur={handleBlur}
      >
        <div className="flex">
          <input
            type="text"
            className="form-input bg-white outline-none px-3 py-2 md:px-4 text-black rounded-md w-full placeholder:text-sm md:placeholder:text-base text-sm md:text-base"
            placeholder="Search Pokemon..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleEnterKey}
            onFocus={handleFocus}
          />
        </div>
        {isFocused && results.length > 0 && (
          <div className="absolute left-0 right-0 bg-white border border-gray-300 rounded mt-12 max-h-64 overflow-y-auto z-10">
            {results.map((pokemon) => (
              <div
                key={pokemon.id}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                onMouseDown={() => handleClick(pokemon)}
              >
                <Image
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 mr-2"
                />
                <div>
                  <p className="text-gray-500 font-bold">{pokemon.name}</p>
                  <p className="text-sm text-gray-500">#{pokemon.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
