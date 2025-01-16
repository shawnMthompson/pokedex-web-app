import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import PokemonGrid from "../components/PokemonGrid";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <SearchBar />
      <PokemonGrid />
      <Footer />
    </>
  );
}
