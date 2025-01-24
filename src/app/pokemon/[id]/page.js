"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchPokemon } from "@/utils/fetchPokemon";
import { formatPokemon } from "@/utils/formatData";
import Image from "next/image";

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

  const pokemonDetails = [
    { label: "Pokedex ID", value: pokemon.id },
    { label: "Introduced", value: "" }, // Generation
    { label: "Category", value: "" }, // 'X' Pokemon (e.g. Bulbsaur is the Seed Pokemon)
    { label: "Weight", value: "" },
    { label: "Height", value: "" },
    { label: "Abilities", value: "\n" },  // Ordered List of Abilities separated by new line
    { label: "Shape", value: "" },
    { label: "Color", value: "" },
  ];

  return (
    <div className="mx-auto flex justify-between p-4 w-2/3">
      <div id="row1">
        <h1 className="text-6xl font-bold mb-4">{pokemon.name}</h1>
        <p className="text-xl mb-4">Types: {pokemon.types.join(", ")}</p>
        <h3 className="mb-4">Description: Lorem Ipsum</h3>
        <table>
          <tbody className="text-left">
            {pokemonDetails.map((detail, index) => (
              <tr key={index}>
                <th className="font-bold text-lg">{detail.label}</th>
                <td className="text-lg">{detail.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <Image
          src={pokemon.sprite}
          alt="Pokemon Sprite"
          height={256}
          width={256}
          priority={true}
        />
      </div>
    </div>
  );
}
