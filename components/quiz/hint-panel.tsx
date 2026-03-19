"use client";

import type { Pokemon } from "@/lib/pokemon";
import { formatDexNumber } from "@/lib/pokemon";
import { getTypeNameKo } from "@/lib/pokeapi";
import { getAvailableScore } from "@/lib/quiz-reducer";

interface HintPanelProps {
  pokemon: Pokemon;
  hintLevel: number;
}

export function HintPanel({ pokemon, hintLevel }: HintPanelProps) {
  if (hintLevel === 0) return null;

  const availableScore = getAvailableScore(hintLevel);
  const typeText = pokemon.types.map((t) => getTypeNameKo(t)).join("/") + " 타입";

  return (
    <div className="text-xs flex items-center gap-3 px-3 py-1 rounded-md bg-card/80 border border-border max-w-[280px] w-full">
      <span className="font-bold shrink-0">{typeText}</span>
      {hintLevel >= 2 && (
        <span className="text-muted-foreground shrink-0">
          도감번호: {formatDexNumber(pokemon.id)}
        </span>
      )}
      <span className="text-muted-foreground ml-auto shrink-0">
        {availableScore}점
      </span>
    </div>
  );
}
