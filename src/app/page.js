import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PokemonGrid from "../components/PokemonGrid";
import UpButton from "@/components/UpButton";

export default function Home() {
  return (
    <>
      <Header />
      <SearchBar />
      <PokemonGrid />
      <UpButton />
    </>
  );
}
