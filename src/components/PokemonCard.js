import Image from "next/image";

// Function will need to take formatted pokemon data from formatData.js
export default function PokemonCard() {
  const pokeballImage = "/pokeball.png"; // Placeholder; Will be a sprite retrieved from PokeAPI later on.

  return (
    <div className="w-full text-white bg-gray-800 border border-gray-200 max-w-52 rounded-lg shadow sm:p-6 md:p-8 m-2">
      <Image
        src={pokeballImage}
        alt="Pokemon Sprite"
        height={96}
        width={96}
        className="mx-auto mb-2"
      ></Image>
      <h2 className="text-2xl font-extrabold text-white text-center mb-5 mt-5">
        #ID
      </h2>
      <h3 className="text-xl font-bold text-white text-center">PokemonName</h3>
    </div>
  );
}
