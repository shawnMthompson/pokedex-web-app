import Link from "next/link";
import Image from "next/image";
import { TYPE_META } from "@/components/PokemonType";

const TYPES = [
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
];

function formatTypeLabel(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export default function TypeFilter() {
  return (
    <section className="container mx-auto px-4 pb-4">
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm md:text-base font-semibold tracking-wide text-white/90 uppercase">
          Browse by type
        </p>
        <div className="w-full max-w-5xl flex flex-wrap justify-center gap-2 md:gap-3">
          {TYPES.map((type) => {
            const typeColor = TYPE_META[type]?.color ?? "#64748b";

            return (
              <Link
                key={type}
                href={`/type/${type}`}
                aria-label={`Filter by ${formatTypeLabel(type)} type`}
                title={formatTypeLabel(type)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 p-2 transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:h-14 md:w-14"
                style={{ backgroundColor: typeColor }}
              >
                <Image
                  src={`/${type}.svg`}
                  alt={`${formatTypeLabel(type)} type`}
                  width={28}
                  height={28}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}