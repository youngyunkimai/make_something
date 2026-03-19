"use client";

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import type { Pokemon } from "@/lib/pokemon";

export type ChoiceState = "idle" | "correct" | "wrong" | "disabled";

interface ChoiceButtonProps {
  pokemon: Pokemon;
  state: ChoiceState;
  selected?: boolean;
  onClick?: () => void;
}

export function ChoiceButton({
  pokemon,
  state,
  selected,
  onClick,
}: ChoiceButtonProps) {
  const isDisabled = state !== "idle";

  return (
    <button
      type="button"
      role="button"
      data-state={state}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={`${pokemon.nameKo} (${pokemon.nameEn})`}
      className={cn(
        "border-2 rounded-lg h-[60px] text-center flex flex-col items-center justify-center gap-0.5 transition-all relative overflow-hidden",
        state === "idle" &&
          "border-border bg-card hover:border-foreground hover:bg-accent cursor-pointer",
        state === "correct" &&
          "border-green-500 bg-green-500/10 ring-2 ring-green-500/30 scale-[1.03]",
        state === "wrong" && selected &&
          "border-red-500 bg-red-500/10 ring-2 ring-red-500/30 scale-[0.97]",
        state === "wrong" && !selected &&
          "border-border bg-card opacity-30",
        state === "disabled" && "border-border bg-card opacity-30"
      )}
    >
      {/* Correct/wrong icon overlay */}
      {state === "correct" && (
        <div className="absolute top-1 right-1">
          <Check className="w-4 h-4 text-green-600" />
        </div>
      )}
      {state === "wrong" && selected && (
        <div className="absolute top-1 right-1">
          <X className="w-4 h-4 text-red-600" />
        </div>
      )}

      {/* Accessible full name for test queries */}
      <span className="sr-only">{pokemon.nameKo} ({pokemon.nameEn})</span>

      {/* Pokemon name: Korean on first line, (English) on second */}
      <span aria-hidden="true" className={cn(
        "text-sm font-bold leading-tight",
        state === "correct" && "text-green-700",
        state === "wrong" && selected && "text-red-700 line-through",
      )}>
        {pokemon.nameKo}
      </span>
      <span aria-hidden="true" className={cn(
        "text-[10px] text-muted-foreground leading-tight",
        state === "correct" && "text-green-600/70",
        state === "wrong" && selected && "text-red-600/70 line-through",
      )}>
        ({pokemon.nameEn})
      </span>
    </button>
  );
}
