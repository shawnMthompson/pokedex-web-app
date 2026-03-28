import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PokemonGrid from "@/components/PokemonGrid";
import UpButton from "@/components/UpButton";

const GENERATION_NAMES = {
  "generation-i": "Generation I - Kanto",
  "generation-ii": "Generation II - Johto",
  "generation-iii": "Generation III - Hoenn",
  "generation-iv": "Generation IV - Sinnoh",
  "generation-v": "Generation V - Unova",
  "generation-vi": "Generation VI - Kalos",
  "generation-vii": "Generation VII - Alola",
  "generation-viii": "Generation VIII - Galar",
  "generation-ix": "Generation IX - Paldea",
};

export default async function GenerationPage({ params }) {
  const { generation } = await params;
  const normalizedGeneration = generation?.toLowerCase();

  if (!GENERATION_NAMES[normalizedGeneration]) {
    notFound();
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 pb-2">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-black tracking-wide text-white text-center">
            {GENERATION_NAMES[normalizedGeneration]}
          </h1>
          <Link
            href="/"
            className="text-sm md:text-base font-semibold text-white/90 underline underline-offset-4 hover:text-white"
          >
            Back to all Pokemon
          </Link>
        </div>
      </div>
      <PokemonGrid filter={{ generation: normalizedGeneration }} />
      <UpButton />
    </>
  );
}
