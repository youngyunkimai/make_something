"use client";

import { cn } from "@/lib/utils";
import { Monitor, Smartphone } from "lucide-react";

export type ViewMode = "mobile" | "desktop";

interface GameFrameProps {
  children: React.ReactNode;
  className?: string;
  viewMode: ViewMode;
  onToggleView: () => void;
}

export function GameFrame({
  children,
  className,
  viewMode,
  onToggleView,
}: GameFrameProps) {
  const isMobile = viewMode === "mobile";

  return (
    <div
      className={cn(
        "relative",
        isMobile
          ? "w-full h-dvh"
          : "min-h-screen flex items-center justify-center p-6 bg-muted"
      )}
    >
      {/* View toggle button */}
      <button
        type="button"
        onClick={onToggleView}
        className={cn(
          "absolute z-50 p-2 rounded-lg border bg-card/90 backdrop-blur-sm hover:bg-accent transition-colors cursor-pointer",
          isMobile
            ? "top-1 right-1"
            : "top-4 right-4"
        )}
        aria-label={isMobile ? "PC 화면으로 전환" : "모바일 화면으로 전환"}
      >
        {isMobile ? (
          <Monitor className="w-4 h-4" />
        ) : (
          <Smartphone className="w-4 h-4" />
        )}
      </button>

      {/* Game container */}
      <div
        className={cn(
          "overflow-hidden bg-card flex flex-col",
          isMobile
            ? "w-full h-full"
            : "w-[375px] h-[667px] border-3 border-foreground rounded-2xl shadow-lg",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function BattleField({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-muted relative flex flex-col items-center justify-center gap-3 p-4 overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

export function MenuPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("border-t-3 border-foreground bg-card p-4", className)}
    >
      {children}
    </div>
  );
}

export function TextBox({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-2 border-foreground rounded-lg bg-card px-4 py-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PokeballDivider() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 shrink-0">
      <div className="flex-1 h-0.5 bg-foreground" />
      <div className="w-5 h-5 border-2 border-foreground rounded-full bg-card relative flex items-center justify-center">
        <div className="w-2 h-2 border-2 border-foreground rounded-full bg-muted" />
      </div>
      <div className="flex-1 h-0.5 bg-foreground" />
    </div>
  );
}
