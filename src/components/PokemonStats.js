export default function PokemonStats({ stats }) {
  return (
    <table className="w-full md:w-4/5 border-collapse">
      <tbody>
        {stats.map((stat, index) => (
          <tr key={index} className="border-b border-gray-400">
            <th className="font-bold text-lg py-2 pr-4 text-left w-1/2 text-nowrap">
              {stat.label}
            </th>
            <td className="text-lg py-2 pl-4 text-left w-1/2 text-nowrap whitespace-pre-line">
              {stat.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
