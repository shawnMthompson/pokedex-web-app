import Image from "next/image";

export default function PokemonCard({ pokemon }) {

  return (
    <div className="w-full text-white bg-gray-800 border border-gray-200 max-w-52 rounded-lg shadow sm:p-6 md:p-8 m-2">
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
