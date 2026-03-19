"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, Check, X } from "lucide-react";
import type { Pokemon } from "@/lib/pokemon";
import { formatPokemonName } from "@/lib/pokemon";

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
      className={cn(
        "border-2 rounded-lg px-3 py-2.5 text-sm text-left flex items-center gap-2 transition-all",
        state === "idle" &&
          "border-border bg-card hover:border-foreground hover:bg-accent cursor-pointer",
        state === "correct" &&
          "border-foreground bg-muted font-bold",
        state === "wrong" &&
          "border-border line-through opacity-70",
        state === "disabled" && "border-border bg-card opacity-40"
      )}
    >
      {state === "correct" && <Check className="w-4 h-4 shrink-0" />}
      {state === "wrong" && selected && <X className="w-4 h-4 shrink-0" />}
      {state === "idle" && (
        <ChevronRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100" />
      )}
      <span>{formatPokemonName(pokemon)}</span>
    </button>
  );
}
