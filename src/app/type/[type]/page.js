import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PokemonGrid from "@/components/PokemonGrid";
import UpButton from "@/components/UpButton";

const VALID_TYPES = new Set([
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
]);

function formatTypeLabel(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export default async function TypePage({ params }) {
  const { type } = await params;
  const normalizedType = type?.toLowerCase();

  if (!VALID_TYPES.has(normalizedType)) {
    notFound();
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 pb-2">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-black tracking-wide text-white text-center">
            {formatTypeLabel(normalizedType)} Type
          </h1>
          <Link
            href="/"
            className="text-sm md:text-base font-semibold text-white/90 underline underline-offset-4 hover:text-white"
          >
            Back to all Pokemon
          </Link>
        </div>
      </div>
      <PokemonGrid filter={{ type: normalizedType }} />
      <UpButton />
    </>
  );
}
