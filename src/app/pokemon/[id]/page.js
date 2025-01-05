"use client";

import { useParams } from "next/navigation";

export default function PokemonPage() {
  const params = useParams();
  const pokemonID = params.id;

  return <p>{pokemonID} page</p>;
}
