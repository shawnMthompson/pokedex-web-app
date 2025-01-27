export default function PokemonStats({ stats }) {
  const maxValues = {
    HP: 255, // Blissey
    Attack: 190, // Deoxys-Attack
    Defense: 230, // Shuckle
    "Special Attack": 194, //Deoxys-Attack
    "Special Defense": 230, //Shuckle
    Speed: 180, // Deoxys-Speed
  };

  const calculateMaxStat = (label, baseStat) => {
    if (label === "HP") {
      return Math.floor(baseStat * 2 + 204);
    } else {
      return Math.floor((baseStat * 2 + 99) * 1.1);
    }
  };

  const calculateMinStat = (label, baseStat) => {
    if (label === "HP") {
      return Math.floor(baseStat * 2 + 110);
    } else {
      return Math.floor((baseStat * 2 + 5) * 0.9);
    }
  };

  const calculatePercentage = (baseStat, maxStat) => {
    return (baseStat / maxStat) * 100;
  };

  return (
    <table className="w-full md:w-4/5 border-collapse">
      <tbody>
        {stats.map((stat, index) => {
          if (stat.label === "Total") {
            return (
              <tr key={index} className="border-b border-gray-400">
                <th className="font-bold text-lg py-2 pr-4 text-left w-1/6 text-nowrap">
                  {stat.label}
                </th>
                <td className="text-lg py-2 pl-4 text-center w-1/6 text-nowrap whitespace-pre-line">
                  {stat.value}
                </td>
                <td className="w-1/3"></td>
                <td className="text-lg py-2 pl-4 text-center w-1/6 text-nowrap whitespace-pre-line">
                  Min
                </td>
                <td className="text-lg py-2 pl-4 text-center w-1/6 text-nowrap whitespace-pre-line">
                  Max
                </td>
              </tr>
            );
          }

          const maxPossibleStat = maxValues[stat.label];
          const percentage = calculatePercentage(stat.value, maxPossibleStat);
          const minStat = calculateMinStat(stat.label, stat.value);
          const maxStat = calculateMaxStat(stat.label, stat.value);

          return (
            <tr key={index} className="border-b border-gray-400">
              <th className="font-bold text-lg py-2 pr-4 text-left w-1/6 text-nowrap">
                {stat.label}
              </th>
              <td className="text-lg py-2 pl-4 text-center w-1/6 text-nowrap whitespace-pre-line">
                {stat.value}
              </td>
              <td className="w-1/3">
                <div className="relative w-full h-2 bg-gray-200 rounded">
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
