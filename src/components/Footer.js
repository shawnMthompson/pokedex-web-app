import { FaRegCopyright } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  return (
    <div className="bg-gray-500 text-white font-bold flex flex-col items-center p-4">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center text-sm sm:text-sm lg:text-lg p-1">
          <FaRegCopyright />
          <p className="ml-1">PokéIndex {year}</p>
        </div>
        <div className="text-sm sm:text-sm lg:text-lg text-center sm:text-left mt-1">
          <p>
            All Pokémon content and materials are trademarks and copyrights of
            Nintendo and Game Freak.
          </p>
        </div>
        <div className="flex items-center text-sm sm:text-sm lg:text-lg mt-1">
          <p className="mr-1">Powered By</p>
          <a target="_blank" href="https://pokeapi.co">
            <Image
              src="/pokeAPI.png"
              alt="pokeAPI"
              width={60}
              height={48}
              className="h-auto w-auto transition-shadow duration-300 hover:jiggle"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
