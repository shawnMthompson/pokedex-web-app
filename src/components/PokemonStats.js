const MAX_VALUES = {
  HP: 255, // Blissey
  Attack: 190, // Deoxys-Attack
  Defense: 230, // Shuckle
  "Special Attack": 194, // Deoxys-Attack
  "Special Defense": 230, // Shuckle
  Speed: 180, // Deoxys-Speed
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const calculateMaxStat = (label, baseStat) => {
  if (label === "HP") {
    return Math.floor(baseStat * 2 + 204);
  }

  return Math.floor((baseStat * 2 + 99) * 1.1);
};

const calculateMinStat = (label, baseStat) => {
  if (label === "HP") {
    return Math.floor(baseStat * 2 + 110);
  }

  return Math.floor((baseStat * 2 + 5) * 0.9);
};

const calculatePercentage = (baseStat, maxStat) => {
  if (!Number.isFinite(baseStat) || !Number.isFinite(maxStat) || maxStat <= 0) {
    return 0;
  }

  return clamp((baseStat / maxStat) * 100, 0, 100);
};

export default function PokemonStats({ stats }) {

  return (
    <table className="w-full md:w-4/5 border-collapse">
      <thead>
        <tr className="border-b border-gray-400">
          <th className="font-bold text-lg py-2 pr-4 text-left w-1/6 text-nowrap" scope="col">
            Stat
          </th>
          <th className="font-bold text-lg py-2 pl-4 text-center w-1/6 text-nowrap" scope="col">
            Base
          </th>
          <th className="font-bold text-lg py-2 text-center w-1/3 text-nowrap" scope="col">
            Progress
          </th>
          <th className="font-bold text-lg py-2 pl-4 text-center w-1/6 text-nowrap" scope="col">
            Min
          </th>
          <th className="font-bold text-lg py-2 pl-4 text-center w-1/6 text-nowrap" scope="col">
            Max
          </th>
        </tr>
      </thead>
      <tbody>
        {stats.map((stat) => {
          const rowKey = `${stat.label}-${stat.value}`;

          if (stat.label === "Total") {
            return (
              <tr key={rowKey}>
                <th className="font-bold text-lg py-2 pr-4 text-left w-1/6 text-nowrap" scope="row">
                  {stat.label}
                </th>
                <td className="text-lg py-2 pl-4 text-center w-1/6 text-nowrap whitespace-pre-line">
                  {stat.value}
                </td>
              </tr>
            );
          }

          const maxPossibleStat = MAX_VALUES[stat.label] ?? Math.max(stat.value, 1);
          const percentage = calculatePercentage(stat.value, maxPossibleStat);
          const minStat = calculateMinStat(stat.label, stat.value);
          const maxStat = calculateMaxStat(stat.label, stat.value);

          return (
            <tr key={rowKey} className="border-b border-gray-400">
              <th className="font-bold text-lg py-2 pr-4 text-left w-1/6 text-nowrap" scope="row">
                {stat.label}
              </th>
              <td className="text-lg py-2 pl-4 text-center w-1/6 text-nowrap whitespace-pre-line">
                {stat.value}
              </td>
              <td className="w-1/3">
                <div className="relative w-full h-2 bg-gray-200 rounded" role="progressbar" aria-label={`${stat.label} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percentage)}>
                  <div
                    className="absolute top-0 left-0 h-2 bg-green-500 rounded"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </td>
              <td className="text-lg py-2 pl-4 text-center w-1/6 text-nowrap whitespace-pre-line">
                {minStat}
              </td>
              <td className="text-lg py-2 pl-4 text-center w-1/6 text-nowrap whitespace-pre-line">
                {maxStat}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
