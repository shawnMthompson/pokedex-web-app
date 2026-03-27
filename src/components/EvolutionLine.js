import Image from "next/image";
import Link from "next/link";

import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowDownLong } from "react-icons/fa6";

// Reusable card renderer so that both branched and linear layouts can stay consistent.
function EvolutionCard({ pokemon, currentSpeciesName }) {
  const isCurrent = pokemon.speciesName === currentSpeciesName;

  return (
    <Link
      href={`/pokemon/${pokemon.speciesName}#evolution-line`}
      className={`border-2 p-3 md:p-4 rounded-md hover:jiggle transition-colors bg-cardBase ${
        isCurrent
          ? "border-foreground bg-cardShadow"
          : "border-cardShadow hover:bg-cardShadow"
      }`}
    >
      <div className="flex flex-col items-center min-w-[140px] md:min-w-[170px]">
        <Image
          src={pokemon.sprite}
          alt={pokemon.displayName}
          width={144}
          height={144}
          className="object-contain"
        />
        <p className="text-base md:text-lg font-bold">#{pokemon.id}</p>
        <p className="text-base md:text-lg text-center">{pokemon.displayName}</p>
      </div>
    </Link>
  );
}

export default function EvolutionLine({ paths = [], currentSpeciesName }) {
  if (!paths.length) {
    return (
      <div className="mt-8 border-2 border-cardShadow p-6 bg-cardBase max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-2">Evolution Line</h2>
        <p className="text-lg">No known evolutions.</p>
      </div>
    );
  }

  function formatEvolutionLabel(labels = []) {
    if (!labels.length) {
      return "";
    }

    if (labels.length === 1) {
      return labels[0];
    }

    // Show multiple valid requirements in a single compact label.
    return labels.join(" / ");
  }

  // Group branch paths into stages and merge duplicate species per stage.
  function buildCompactStages(paths) {
    const stageMaps = [];

    paths.forEach((path) => {
      path.forEach((pokemon, stageIndex) => {
        if (!stageMaps[stageIndex]) {
          stageMaps[stageIndex] = new Map();
        }

        const existing = stageMaps[stageIndex].get(pokemon.speciesName);
        if (existing) {
          if (
            pokemon.evolutionLabel &&
            !existing.evolutionLabels.includes(pokemon.evolutionLabel)
          ) {
            existing.evolutionLabels.push(pokemon.evolutionLabel);
          }
          return;
        }

        stageMaps[stageIndex].set(pokemon.speciesName, {
          ...pokemon,
          evolutionLabels:
            pokemon.evolutionLabel && pokemon.evolutionLabel !== "Base"
              ? [pokemon.evolutionLabel]
              : [],
        });
      });
    });

    return stageMaps.map((stageMap) => Array.from(stageMap.values()));
  }

  // Multi-branch chains use a stage layout to avoid repeating shared roots.
  const hasBranches = paths.length > 1;
  const compactStages = hasBranches ? buildCompactStages(paths) : [];

  return (
    <div className="mt-8 p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Evolution Line</h2>
      {hasBranches ? (
        <div className="space-y-6">
          {compactStages.map((stage, stageIndex) => (
            <div key={`stage-${stageIndex}`} className="space-y-3">
              {stageIndex > 0 && (
                <div className="flex justify-center">
                  <span className="text-2xl md:text-3xl font-bold">↓</span>
                </div>
              )}
              <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-4 md:gap-6">
                {stage.map((pokemon) => (
                  <div
                    key={`${pokemon.speciesName}-${stageIndex}`}
                    className="w-[180px] md:w-[220px] flex flex-col items-center gap-2"
                  >
                    {stageIndex > 0 && (
                      // Reserve vertical space so that mixed label lengths avoid shifting other cards.
                      <span className="w-[150px] md:w-[215px] min-h-[48px] md:min-h-[120px] px-1 text-sm md:text-base text-center leading-tight flex items-center justify-center whitespace-pre-line break-normal">
                        {formatEvolutionLabel(pokemon.evolutionLabels)}
                      </span>
                    )}
                    <EvolutionCard
                      pokemon={pokemon}
                      currentSpeciesName={currentSpeciesName}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {paths.map((path, pathIndex) => (
            <div
              key={`path-${pathIndex}`}
              className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-4 md:gap-6"
            >
              {path.map((pokemon, index) => {
                const evolutionLabel =
                  index < path.length - 1 ? path[index + 1].evolutionLabel : null;

                return (
                  <div key={`${pokemon.speciesName}-${index}`} className="contents">
                    <EvolutionCard
                      pokemon={pokemon}
                      currentSpeciesName={currentSpeciesName}
                    />

                    {evolutionLabel && (
                      // Keep connector width stable so that arrows/cards will stay visually centered.
                      <div className="w-auto md:w-[125px] flex flex-col items-center px-2 md:px-3">
                        <FaArrowDownLong className="text-xl md:hidden" />
                        <FaArrowRightLong className="hidden md:inline text-xl md:text-2xl" />
                        <span className="min-h-[40px] md:min-h-[48px] text-sm md:text-base leading-tight text-center flex items-center justify-center whitespace-pre-line break-normal">
                          {evolutionLabel}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
