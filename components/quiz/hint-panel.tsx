"use client";

import type { Pokemon } from "@/lib/pokemon";
import { formatDexNumber } from "@/lib/pokemon";
import { getTypeNameKo } from "@/lib/pokeapi";
import { getAvailableScore } from "@/lib/quiz-reducer";

interface HintPanelProps {
  pokemon: Pokemon;
  hintLevel: number;
}

const BASE_SCORE = 100;

export function HintPanel({ pokemon, hintLevel }: HintPanelProps) {
  if (hintLevel === 0) return null;

  const availableScore = getAvailableScore(hintLevel);
  const penalty = BASE_SCORE - availableScore;
  const typeText = pokemon.types.map((t) => getTypeNameKo(t)).join(" / ") + " 타입";

  return (
    <div className="flex flex-col items-center gap-0.5 w-full max-w-[300px]">
      {/* Line 1: hint info */}
      <span className="text-sm font-bold">
        {typeText}
        {hintLevel >= 2 && (
          <span className="text-muted-foreground font-normal ml-2">
            도감번호: {formatDexNumber(pokemon.id)}
          </span>
        )}
      </span>

      {/* Line 2: score penalty */}
      <span className="text-xs text-muted-foreground">
        <span className="line-through">{BASE_SCORE}</span>
        {" → "}
        <span className="font-bold text-foreground">{availableScore}점</span>
        <span className="text-red-500 ml-1">-{penalty}</span>
      </span>
    </div>
  );
}
