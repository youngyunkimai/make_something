"use client";

import { TextBox } from "./game-frame";
import type { Pokemon } from "@/lib/pokemon";
import { formatDexNumber } from "@/lib/pokemon";
import { getTypeNameKo } from "@/lib/pokeapi";
import { getAvailableScore } from "@/lib/quiz-reducer";

interface HintPanelProps {
  pokemon: Pokemon;
  hintLevel: number;
}

export function HintPanel({ pokemon, hintLevel }: HintPanelProps) {
  const availableScore = getAvailableScore(hintLevel);

  if (hintLevel === 0) {
    return null;
  }

  return (
    <TextBox className="text-xs max-w-[280px] w-full">
      <div className="flex items-center justify-between">
        <span>
          {pokemon.types.map((t) => getTypeNameKo(t)).join(" / ")} 타입
        </span>
        <span className="text-muted-foreground">
          획득: {availableScore}점
        </span>
      </div>
      {hintLevel >= 2 && (
        <p className="mt-1 text-muted-foreground">
          도감번호: {formatDexNumber(pokemon.id)}
        </p>
      )}
    </TextBox>
  );
}
