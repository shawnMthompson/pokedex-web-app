"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { fetchPokemon, fetchPokemonSpecies } from "@/utils/fetchPokemon";
import { formatPokemon, formatPokemonSpecies } from "@/utils/formatPokemonData";
import Image from "next/image";

import SearchBar from "@/components/SearchBar";
import PokemonType from "@/components/PokemonType";
import PokemonDetails from "@/components/PokemonDetails";
import PokemonStats from "@/components/PokemonStats";
import Footer from "@/components/Footer";
import HeaderLogo from "../../../../public/logo.png";

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
  const [activeTab, setActiveTab] = useState("details");

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

  const pokemonDetails = [
    {
      label: "Pokedex ID",
      value: `#${pokemon.id}`,
    },
    {
      label: "Introduced",
      value: pokemon.generation,
    },
    {
      label: "Category",
      value: pokemon.category,
    },
    {
      label: "Height",
      value: `${pokemon.height / 10} m`,
    },
    {
      label: "Weight",
      value: `${pokemon.weight / 10} kg`,
    },
    {
      label: "Abilities",
      value: pokemon.abilities
        .map((ability, index) => `${index + 1}. ${ability}`)
        .join("\n"),
    },
    {
      label: "Color",
      value: pokemon.color,
    },
  ];

  const pokemonStats = [
    {
      label: "HP",
      value: pokemon.hp,
    },
    {
      label: "Attack",
      value: pokemon.attack,
    },
    {
      label: "Defense",
      value: pokemon.defense,
    },
    {
      label: "Special Attack",
      value: pokemon.special_attack,
    },
    {
      label: "Special Defense",
      value: pokemon.special_defense,
    },
    {
      label: "Speed",
      value: pokemon.speed,
    },
    {
      label: "Total",
      value: pokemon.total,
    },
  ];

  const pokemonMoves = pokemon.moves;

  return (
    <div className="min-h-screen flex flex-col">
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
      <div className="flex-grow mx-auto flex flex-col md:flex-row justify-between p-4 w-full md:w-2/3">
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
        <div className="md:w-1/2 order-2 md:order-none">
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
          <div className="flex justify-center md:justify-start mb-4 space-x-4">
            <button
              onClick={() => setActiveTab("details")}
              className="border-2 p-1 bg-cardShadow"
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className="border-2 p-1 bg-cardShadow"
            >
              Stats
            </button>
          </div>
          <div className="max-h-[600px]">
            {activeTab === "details" && (
              <PokemonDetails details={pokemonDetails} />
            )}
            {activeTab === "stats" && <PokemonStats stats={pokemonStats} />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
