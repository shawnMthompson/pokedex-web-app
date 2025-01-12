"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchPokemon } from "@/utils/fetchPokemon";
import { formatPokemon } from "@/utils/formatData";

export async function fetchAndFormatPokemon(pokemonID) {
  const lowercasedID = pokemonID.toLowerCase();
  const rawData = await fetchPokemon(lowercasedID);
  const formattedData = formatPokemon(rawData);
  return formattedData;
}

export default function PokemonPage() {
  const params = useParams();
  const pokemonID = params.id;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAndFormatPokemon(pokemonID);
        setPokemon(data);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pokemonID]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!pokemon) {
    return <p>Failed to load Pokémon data.</p>;
  }

  return (
    <div>
      <h1>{pokemon.name}</h1>
      <p>ID: {pokemon.id}</p>
      <p>Types: {pokemon.types.join(", ")}</p>
    </div>
  );
}
