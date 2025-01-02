import Image from "next/image";

// More responsive work needs to be done here still.

export default function PokemonCard({ pokemon }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden text-gray-500">
      <Image
        src={pokemon.sprite}
        alt="Pokemon Sprite"
        height={256}
        width={256}
        priority={true}
        className="p-4"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold">#{pokemon.id}</h2>
        <h3 className="text-lg">{pokemon.name}</h3>
      </div>
    </div>
  );
}
