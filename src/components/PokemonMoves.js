"use client";

import { useState } from "react";

export default function PokemonMoves({ moves }) {
  const [activeTab, setActiveTab] = useState("level-up");

  // Separate moves by learn method
  const levelUpMoves = moves
    .filter((move) => move.method === "level-up")
    .sort((a, b) => a.level - b.level);

  const machineeMoves = moves
    .filter((move) => move.method === "machine")
    .sort((a, b) => a.name.localeCompare(b.name));

  const displayedMoves = activeTab === "level-up" ? levelUpMoves : machineeMoves;

  return (
    <div className="w-full">
      <div className="flex justify-center md:justify-start mb-4 space-x-2">
        <button
          onClick={() => setActiveTab("level-up")}
          className={`border-2 p-2 px-4 bg-cardShadow hover:jiggle ${
            activeTab === "level-up" ? "bg-gray-500" : ""
          }`}
        >
          Level-up ({levelUpMoves.length})
        </button>
        <button
          onClick={() => setActiveTab("machine")}
          className={`border-2 p-2 px-4 bg-cardShadow hover:jiggle ${
            activeTab === "machine" ? "bg-gray-500" : ""
          }`}
        >
          TM/HM ({machineeMoves.length})
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto border border-gray-400">
        <table className="w-full border-collapse">
          <thead className="sticky top-0">
            <tr className="border-b-2 border-gray-400 bg-cardShadow">
              <th className="text-left py-2 px-4">Move Name</th>
              <th className="text-center py-2 px-4">Type</th>
              <th className="text-center py-2 px-4">Damage Class</th>
              <th className="text-center py-2 px-4">Power</th>
              <th className="text-center py-2 px-4">Accuracy</th>
              <th className="text-center py-2 px-4">PP</th>
              {activeTab === "level-up" && (
                <th className="text-center py-2 px-4">Level</th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayedMoves.length === 0 ? (
              <tr>
                <td colSpan={activeTab === "level-up" ? 7 : 6} className="py-4 px-4 text-center text-gray-500">
                  No {activeTab === "level-up" ? "level-up" : "TM/HM"} moves available
                </td>
              </tr>
            ) : (
              displayedMoves.map((move, index) => (
                <tr key={index} className="border-b border-gray-400">
                  <td className="py-3 px-4 text-left">{move.name}</td>
                  <td className="py-3 px-4 text-center capitalize">{move.type}</td>
                  <td className="py-3 px-4 text-center capitalize">{move.damageClass}</td>
                  <td className="py-3 px-4 text-center">{move.power || "-"}</td>
                  <td className="py-3 px-4 text-center">{move.accuracy ? `${move.accuracy}%` : "-"}</td>
                  <td className="py-3 px-4 text-center">{move.pp || "-"}</td>
                  {activeTab === "level-up" && (
                    <td className="py-3 px-4 text-center">
                      {move.level === 0 ? "Start" : `LVL ${move.level}`}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
