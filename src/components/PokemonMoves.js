export default function PokemonMoves({ moves }) {
  return (
    <div className="flex flex-wrap gap-2">
      {moves.map((move, index) => (
        <div
          key={index}
          className="border border-gray-400 p-1 rounded-md shadow-sm"
        >
          <h3 className="text-sm">{move}</h3>
        </div>
      ))}
    </div>
  );
}
