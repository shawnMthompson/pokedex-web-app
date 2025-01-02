import Image from "next/image";

// More responsive work needs to be done here still.

export default function PokemonCard({ pokemon }) {
  return (
    <div className="text-white bg-gray-800 border border-gray-200 rounded-lg shadow p-4 m-2">
      <Image
        src={pokemon.sprite}
        alt="Pokemon Sprite"
        height={256}
        width={256}
        className="mx-auto mb-2"
      ></Image>
      <h2 className="text-2xl font-extrabold text-white text-center mb-5 mt-5">
        #{pokemon.id}
      </h2>
      <h3 className="text-xl font-bold text-white text-center">
        {pokemon.name}
      </h3>
    </div>
  );
}
