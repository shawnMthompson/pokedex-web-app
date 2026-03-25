"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchAndFormatAllPokemon,
  fetchPokemonNamesByType,
  fetchPokemonNamesByGeneration,
  fetchAndFormatPokemonByNames,
} from "@/utils/fetchAllPokemon";

const PAGE_SIZE = 24;

/**
 * Handles paginated pokemon fetching with optional filtering.
 *
 * @param {Object|null} filter - Optional filter: { type: "fire" } or { generation: "generation-i" }
 * @returns {{ pokemonList, hasMore, loading, fetchMore }}
 */
export function usePokemonPagination(filter = null) {
  const [pokemonList, setPokemonList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // Capture the filter value at mount time (filter is static per page instance).
  const filterRef = useRef(filter);
  // Cache of all names when using a filter (loaded on the first page fetch).
  const filteredNamesRef = useRef(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);

        const activeFilter = filterRef.current;
        let data;

        if (!activeFilter) {
          // Unfiltered: standard offset-based pagination
          const offset = (page - 1) * PAGE_SIZE;
          data = await fetchAndFormatAllPokemon(PAGE_SIZE, offset);

          // Prefetch the next batch to warm the cache
          if (data.length === PAGE_SIZE) {
            fetchAndFormatAllPokemon(PAGE_SIZE, offset + PAGE_SIZE);
          }
        } else {
          // Filtered: load all matching names once, then paginate locally
          if (filteredNamesRef.current === null) {
            if (activeFilter.type) {
              filteredNamesRef.current = await fetchPokemonNamesByType(
                activeFilter.type
              );
            } else if (activeFilter.generation) {
              filteredNamesRef.current = await fetchPokemonNamesByGeneration(
                activeFilter.generation
              );
            } else {
              filteredNamesRef.current = [];
            }
          }

          const allNames = filteredNamesRef.current;
          const start = (page - 1) * PAGE_SIZE;
          const pageNames = allNames.slice(start, start + PAGE_SIZE);
          data =
            pageNames.length > 0
              ? await fetchAndFormatPokemonByNames(pageNames)
              : [];
        }

        setPokemonList((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          return [...prev, ...data.filter((p) => !existingIds.has(p.id))];
        });

        setLoading(false);
        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        console.error(`[usePokemonPagination] Page ${page} failed:`, err);
        setError(err);
        setLoading(false);
        setHasMore(false);
      }
    };

    fetchPage();
  }, [page]);

  const fetchMore = useCallback(() => {
    if (hasMore) setPage((p) => p + 1);
  }, [hasMore]);

  return { pokemonList, hasMore, loading, error, fetchMore };
}
