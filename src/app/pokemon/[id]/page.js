"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchPokemon } from "@/utils/fetchPokemon";
import { formatPokemon } from "@/utils/formatData";
import { fetchPokemonSpecies } from "@/utils/fetchPokemon";
import { formatPokemonSpecies } from "@/utils/formatData";
import { useRouter } from "next/navigation";
import HeaderLogo from "../../../../public/logo.png";
import SearchBar from "@/components/SearchBar";
import Image from "next/image";
import PokemonType from "@/components/PokemonType";

export async function fetchAndFormatPokemon(pokemonID) {
  const lowercasedID = pokemonID.toLowerCase();
  const rawData = await fetchPokemon(lowercasedID);
  const formattedData = formatPokemon(rawData);
  return formattedData;
}

export async function fetchAndFormatPokemonSpecies(pokemonID) {
  const lowercasedID = pokemonID.toLowerCase();
  const rawData = await fetchPokemonSpecies(lowercasedID);
  const formattedData = formatPokemonSpecies(rawData);
  return formattedData;
}

export default function PokemonPage() {
  const params = useParams();
  const pokemonID = params.id;
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const handleClick = () => router.push("/");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pokemonData = await fetchAndFormatPokemon(pokemonID);
        const speciesData = await fetchAndFormatPokemonSpecies(pokemonID);
        setPokemon({ ...pokemonData, ...speciesData });
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

  const generationRanges = [
    { min: 1, max: 151, generation: "I" },
    { min: 152, max: 251, generation: "II" },
    { min: 252, max: 386, generation: "III" },
    { min: 387, max: 493, generation: "IV" },
    { min: 494, max: 649, generation: "V" },
    { min: 650, max: 721, generation: "VI" },
    { min: 722, max: 809, generation: "VII" },
    { min: 810, max: 905, generation: "VIII" },
    { min: 906, max: 1025, generation: "IX" },
  ];

  const pokemonGeneration = (id) => {
    const generation = generationRanges.find(
      (range) => id >= range.min && id <= range.max
    );
    return generation ? generation.generation : "Unknown";
  };

  const pokemonDetails = [
    { label: "Pokedex ID", value: `#${pokemon.id}` },
    {
      label: "Introduced",
      value: `Generation ${pokemonGeneration(pokemon.id)}`,
    },
    { label: "Category", value: "" }, // 'X' Pokemon (e.g. Bulbsaur is the Seed Pokemon)
    { label: "Weight", value: "" },
    { label: "Height", value: "" },
    { label: "Abilities", value: "\n" }, // Ordered List of Abilities separated by new line
    { label: "Shape", value: "" },
    { label: "Color", value: `${pokemon.color}` },
  ];

  console.log(pokemon);

  return (
    <>
      <div>
        <div className="bg-cardBase p-2 flex justify-evenly items-center">
          <Image
            src={HeaderLogo}
            alt={"PokeIndex"}
            height={256}
            width={256}
            priority={true}
            className="cursor-pointer hover:jiggle"
            onClick={handleClick}
          />
          <SearchBar />
        </div>
      </div>
      <div className="mx-auto flex flex-col md:flex-row justify-between p-4 w-full md:w-2/3">
        <div className="flex justify-center items-center md:w-1/2 mt-8 md:mt-0 order-1 md:order-2">
          <Image
            src={pokemon.sprite}
            alt="Pokemon Sprite"
            height={512}
            width={512}
            priority={true}
            className="up-and-down"
          />
        </div>
        <div id="row1" className="md:w-1/2 order-2 md:order-none">
          <h1 className="text-6xl font-bold mb-4 text-center md:text-left">
            {pokemon.name}
          </h1>
          <div className="flex justify-center md:justify-start mb-4 space-x-4">
            {pokemon.types.map((type) => (
              <PokemonType key={type} type={type} />
            ))}
          </div>
          <h3 className="mb-4 md:text-left text-center text-2xl w-full md:w-3/4">
            {pokemon.description}
          </h3>
          <table className="w-full md:w-4/5 border-collapse">
            <tbody>
              {pokemonDetails.map((detail, index) => (
                <tr key={index} className="border-b border-gray-400">
                  <th className="font-bold text-lg py-2 pr-4 text-left w-1/2 text-nowrap">
                    {detail.label}
                  </th>
                  <td className="text-lg py-2 pl-4 text-left w-1/2 text-nowrap">
                    {detail.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
