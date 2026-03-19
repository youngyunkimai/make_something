"use client";

import { cn } from "@/lib/utils";

type SilhouetteState = "hidden" | "half" | "revealed";

interface SilhouetteImageProps {
  src: string;
  pokemonName: string;
  state: SilhouetteState;
  className?: string;
}

const FILTER_MAP: Record<SilhouetteState, string> = {
  hidden: "brightness(0)",
  half: "brightness(0.5)",
  revealed: "none",
};

export function SilhouetteImage({
  src,
  pokemonName,
  state,
  className,
}: SilhouetteImageProps) {
  const isRevealed = state === "revealed";
  const altText = isRevealed ? pokemonName : "실루엣";

  return (
    <img
      src={src}
      alt={altText}
      data-state={state}
      className={cn("w-[180px] h-[180px] object-contain transition-all duration-500", className)}
      style={{ filter: FILTER_MAP[state] }}
    />
  );
}
