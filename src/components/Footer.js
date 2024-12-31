import { FaRegCopyright } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  // Retrieve Current Year
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  return (
    <div className="bg-gray-500 text-white font-bold p-4 flex justify-evenly ">
      <div className="flex items-center">
        <FaRegCopyright />
        <p className="ml-1">PokéIndex {year}</p>
      </div>
      <div className="flex flex-col items-center max-w-100 text-center text-sm">
        <Image
          src="/pokeball.png"
          alt="pokeballIcon"
          width={54}
          height={48}
          className="mb-2"
        ></Image>
        <p className="">
          All Pokémon content and materials are trademarks and copyrights of
          Nintendo and Game Freak.
        </p>
      </div>
      <div className="flex items-center">
        <p className="mr-1">Powered By</p>
        <a target="_blank" href="https://pokeapi.co">
          <Image
            src="/pokeAPI.png"
            alt="pokeAPI"
            width={60}
            height={48}
            className="ml-1"
          ></Image>
        </a>
      </div>
    </div>
  );
}
