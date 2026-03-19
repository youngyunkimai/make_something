"use client";

import { cn } from "@/lib/utils";

interface PokeballSvgProps {
  size?: number;
  className?: string;
}

export function PokeballSvg({ size = 120, className }: PokeballSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("drop-shadow-lg", className)}
      aria-label="포켓볼"
    >
      {/* Outer circle */}
      <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="4" fill="none" />

      {/* Top half — red */}
      <path
        d="M4 60 A56 56 0 0 1 116 60 Z"
        fill="hsl(var(--primary))"
        stroke="currentColor"
        strokeWidth="4"
      />

      {/* Bottom half — white */}
      <path
        d="M4 60 A56 56 0 0 0 116 60 Z"
        fill="white"
        stroke="currentColor"
        strokeWidth="4"
      />

      {/* Center band */}
      <rect x="4" y="56" width="112" height="8" fill="currentColor" />

      {/* Center button — outer ring */}
      <circle cx="60" cy="60" r="16" fill="white" stroke="currentColor" strokeWidth="4" />

      {/* Center button — inner circle */}
      <circle cx="60" cy="60" r="8" fill="currentColor" />

      {/* Shine highlight */}
      <ellipse cx="38" cy="32" rx="12" ry="8" fill="white" opacity="0.3" transform="rotate(-20 38 32)" />
    </svg>
  );
}
