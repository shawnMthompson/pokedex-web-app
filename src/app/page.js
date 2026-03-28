import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import GenerationFilter from "../components/GenerationFilter";
import TypeFilter from "../components/TypeFilter";
import PokemonGrid from "../components/PokemonGrid";
import UpButton from "@/components/UpButton";

export default function Home() {
  return (
    <>
      <Header />
      <SearchBar />
      <GenerationFilter />
      <TypeFilter />
      <PokemonGrid />
      <UpButton />
    </>
  );
}
