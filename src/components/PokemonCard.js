"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PokemonCard({ pokemon }) {
  const router = useRouter();
  const handleClick = () =>
    router.push(`/pokemon/${pokemon.name.toLowerCase()}`);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-cardBase shadow-md hover:shadow-lg rounded-lg overflow-hidden text-gray-500 cursor-pointer transition-shadow duration-300 hover:jiggle"
    >
      <Image
        src={pokemon.sprite}
        alt="Pokemon Sprite"
        height={256}
        width={256}
        priority={true}
        className={`${isHovered ? "up-and-down" : ""} p-4`}
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-foreground">#{pokemon.id}</h3>
        <h2 className="text-lg text-foreground">{pokemon.name}</h2>
      </div>
    </div>
  );
}
