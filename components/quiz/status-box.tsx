"use client";

import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

export function StatusBox({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-2 border-foreground rounded-lg bg-card px-3 py-2",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ScoreBar({
  percentage,
  className,
}: {
  percentage: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-full overflow-hidden h-1 bg-muted",
        className
      )}
    >
      <div
        className="rounded-full h-full bg-foreground transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      />
    </div>
  );
}

export function ProgressDots({
  total,
  filled,
  className,
}: {
  total: number;
  filled: number;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "w-2.5 h-2.5 rounded-full border-2 border-foreground",
            i < filled ? "bg-foreground" : "bg-card"
          )}
        />
      ))}
    </div>
  );
}

export function ComboDisplay({ combo }: { combo: number }) {
  if (combo < 2) return null;
  return (
    <span className="text-xs text-muted-foreground flex items-center gap-1">
      <Flame className="w-3 h-3" />
      {combo} 콤보!
    </span>
  );
}
