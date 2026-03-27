"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  fetchPokemon,
  fetchPokemonSpecies,
  fetchEvolutionChain,
} from "@/utils/fetchPokemon";
import { formatPokemon, formatPokemonSpecies } from "@/utils/formatPokemonData";
import Image from "next/image";

import SearchBar from "@/components/SearchBar";
import PokemonType from "@/components/PokemonType";
import PokemonDetails from "@/components/PokemonDetails";
import PokemonStats from "@/components/PokemonStats";
import EvolutionLine from "@/components/EvolutionLine";
import HeaderLogo from "../../../../public/logo.png";

function titleCase(slug) {
  return slug
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

// Keep condition labels compact so evolution cards remain visually aligned.
function buildLevelUpConditionText(evolutionDetail) {
  const conditions = [];

  if (evolutionDetail.min_level != null) {
    conditions.push(`Lvl ${evolutionDetail.min_level}+`);
  }

  if (evolutionDetail.min_happiness != null) {
    conditions.push(`Friendship ${evolutionDetail.min_happiness}+`);
  } else if (evolutionDetail.min_affection != null) {
    conditions.push(`Affection ${evolutionDetail.min_affection}+`);
  }

  if (evolutionDetail.known_move_type?.name) {
    conditions.push(`${titleCase(evolutionDetail.known_move_type.name)} move`);
  }

  if (evolutionDetail.location?.name) {
    conditions.push("Special area");
  }

  if (evolutionDetail.time_of_day) {
    conditions.push(titleCase(evolutionDetail.time_of_day));
  }

  return conditions.slice(0, 2).join(", ");
}

// Convert one evolution detail object into a user-facing requirement label.
function formatEvolutionRequirement(evolutionDetail) {
  if (!evolutionDetail) {
    return "Special";
  }

  if (evolutionDetail.trigger?.name === "use-item" && evolutionDetail.item?.name) {
    return `Use ${titleCase(evolutionDetail.item.name)}`;
  }

  if (evolutionDetail.trigger?.name === "trade") {
    if (evolutionDetail.held_item?.name) {
      return `Trade while holding ${titleCase(evolutionDetail.held_item.name)}`;
    }

    if (evolutionDetail.trade_species?.name) {
      return `Trade for ${titleCase(evolutionDetail.trade_species.name)}`;
    }

    return "Trade";
  }

  if (evolutionDetail.trigger?.name === "level-up") {
    const conditionText = buildLevelUpConditionText(evolutionDetail);
    return conditionText ? `Level-up\n(${conditionText})` : "Level-up";
  }

  if (evolutionDetail.trigger?.name) {
    return titleCase(evolutionDetail.trigger.name);
  }

  return "Special";
}

// PokeAPI can return multiple valid requirements for one branch.
function formatEvolutionRequirements(evolutionDetails = []) {
  if (!evolutionDetails.length) {
    return "Special";
  }

  const labels = evolutionDetails
    .map((detail) => formatEvolutionRequirement(detail))
    .filter(Boolean);

  const uniqueLabels = [...new Set(labels)];

  if (uniqueLabels.length > 2) {
    return `${uniqueLabels[0]} or ${uniqueLabels[1]}`;
  }

  return uniqueLabels.join(" or ");
}

// Flatten the recursive chain into linear paths for the UI component.
function collectEvolutionPaths(chainNode, incomingEvolutionLabel = "Base") {
  const currentNode = {
    speciesName: chainNode.species.name,
    evolutionLabel: incomingEvolutionLabel,
  };

  if (!chainNode.evolves_to?.length) {
    return [[currentNode]];
  }

  const paths = [];

  chainNode.evolves_to.forEach((nextNode) => {
    const evolutionLabel = formatEvolutionRequirements(nextNode.evolution_details);
    const childPaths = collectEvolutionPaths(nextNode, evolutionLabel);

    childPaths.forEach((childPath) => {
      paths.push([currentNode, ...childPath]);
    });
  });

  return paths;
}

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
  const [evolutionPaths, setEvolutionPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  const router = useRouter();
  const handleClick = () => router.push("/");

  useEffect(() => {
    // Main fetch keeps base Pokemon data independent from evolution-chain failures.
    const fetchData = async () => {
      try {
        const pokemonData = await fetchAndFormatPokemon(pokemonID);
        let speciesData;

        try {
          speciesData = await fetchAndFormatPokemonSpecies(pokemonID);
        } catch (speciesError) {
          console.warn(
            `[PokemonPage] Species data unavailable for "${pokemonID}":`,
            speciesError
          );
          speciesData = {
            color: "Unknown",
            description: "No species description available for this form.",
            generation: "Unknown",
            category: "Unknown",
            evolution_chain_url: null,
          };
        }

        setPokemon({ ...pokemonData, ...speciesData });

        if (speciesData.evolution_chain_url) {
          try {
            // Evolution data is best-effort: partial failures "should" not blank the page.
            const rawEvolutionData = await fetchEvolutionChain(
              speciesData.evolution_chain_url
            );
            const rawPaths = collectEvolutionPaths(rawEvolutionData.chain);
            const uniqueSpeciesNames = [
              ...new Set(rawPaths.flat().map((entry) => entry.speciesName)),
            ];

            const settledSpeciesCards = await Promise.allSettled(
              uniqueSpeciesNames.map(async (speciesName) => {
                const formatted = await fetchAndFormatPokemon(speciesName);
                return {
                  speciesName,
                  id: formatted.id,
                  displayName: formatted.name,
                  sprite: formatted.sprite,
                };
              })
            );

            const speciesCards = settledSpeciesCards
              .filter((result) => result.status === "fulfilled")
              .map((result) => result.value);

            const speciesMap = speciesCards.reduce((acc, species) => {
              acc[species.speciesName] = species;
              return acc;
            }, {});

            const hydratedPaths = rawPaths
              .map((path) =>
                path
                  .map((entry) => {
                    const species = speciesMap[entry.speciesName];
                    if (!species) {
                      return null;
                    }

                    return {
                      ...species,
                      evolutionLabel: entry.evolutionLabel,
                    };
                  })
                  .filter(Boolean)
              )
                  // Drop empty paths if all species requests failed for that branch.
              .filter((path) => path.length > 0);

            setEvolutionPaths(hydratedPaths);
          } catch (evolutionError) {
            console.warn("[PokemonPage] Evolution data unavailable:", evolutionError);
            setEvolutionPaths([]);
          }
        } else {
          setEvolutionPaths([]);
        }
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pokemonID]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.location.hash !== "#evolution-line") {
      return;
    }

    if (!pokemon) {
      return;
    }

    const timeoutId = setTimeout(() => {
      // Delay ensures that the section is mounted properly before scrolling.
      const evolutionSection = document.getElementById("evolution-line");
      if (evolutionSection) {
        evolutionSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pokemon]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <div>
        <div className="bg-cardBase p-2">
          {/* Desktop layout - horizontal */}
          <div className="hidden md:flex justify-evenly items-center">
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

          {/* Mobile layout - vertical stack */}
          <div className="md:hidden flex flex-col items-center space-y-4">
            <Image
              src={HeaderLogo}
              alt={"PokeIndex"}
              height={200}
              width={200}
              priority={true}
              className="cursor-pointer hover:jiggle"
              onClick={handleClick}
            />
            <div className="w-full">
              <SearchBar />
            </div>
          </div>
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
              className={`border-2 p-1 w-1/3 bg-cardShadow hover:jiggle ${
                activeTab === "details" ? "bg-gray-500" : ""
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`border-2 p-1 w-1/3 bg-cardShadow hover:jiggle ${
                activeTab === "stats" ? "bg-gray-500" : ""
              }`}
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
      <div
        id="evolution-line"
        className="px-4 pb-8 md:px-8 lg:px-12 scroll-mt-4 md:scroll-mt-8"
      >
        <EvolutionLine
          paths={evolutionPaths}
          currentSpeciesName={pokemon.species_name}
        />
      </div>
    </div>
  );
}
