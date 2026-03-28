import Link from "next/link";

const GENERATIONS = [
  { slug: "generation-i", label: "Gen I - Kanto" },
  { slug: "generation-ii", label: "Gen II - Johto" },
  { slug: "generation-iii", label: "Gen III - Hoenn" },
  { slug: "generation-iv", label: "Gen IV - Sinnoh" },
  { slug: "generation-v", label: "Gen V - Unova" },
  { slug: "generation-vi", label: "Gen VI - Kalos" },
  { slug: "generation-vii", label: "Gen VII - Alola" },
  { slug: "generation-viii", label: "Gen VIII - Galar" },
  { slug: "generation-ix", label: "Gen IX - Paldea" },
];

export default function GenerationFilter() {
  return (
    <section className="container mx-auto px-4 pb-2">
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm md:text-base font-semibold tracking-wide text-white/90 uppercase">
          Browse by generation
        </p>
        <div className="w-full max-w-5xl flex flex-wrap justify-center gap-2 md:gap-3">
          {GENERATIONS.map((generation) => (
            <Link
              key={generation.slug}
              href={`/generation/${generation.slug}`}
              className="rounded-full border border-white/40 bg-white/15 px-4 py-2 text-xs md:text-sm font-bold text-white transition hover:bg-white hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {generation.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}