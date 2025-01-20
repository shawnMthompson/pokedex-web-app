"use client";

import { useState, useEffect } from "react";
import { searchPokemon } from "@/utils/searchQuery";
import { fetchAndFormatAllPokemon } from "@/utils/fetchAllPokemon";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SearchBar() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false); // State to track focus

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        const searchResults = await searchPokemon(query);
        setResults(searchResults);
      } else if (isFocused) {
        const defaultResults = await fetchAndFormatAllPokemon(14, 0);
        setResults(defaultResults);
      } else {
        setResults([]);
      }
    };

    fetchResults();
  }, [query, isFocused]);

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
    <div className="flex flex-wrap justify-center p-4">
      <div
        className="relative flex flex-col w-full max-w-md"
        onBlur={handleBlur}
      >
        <div className="flex">
          <input
            type="text"
            className="form-input bg-white outline-none px-4 py-2 text-black rounded-l-md w-full"
            placeholder="Search Pokemon..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
          />
          <button className="bg-white outline-none px-4 py-2 font-bold text-black rounded-r-md">
            v
          </button>
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
