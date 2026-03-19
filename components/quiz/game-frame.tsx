"use client";

import { cn } from "@/lib/utils";

export function GameFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-3 border-foreground rounded-2xl overflow-hidden bg-card w-[375px] h-[667px] mx-auto flex flex-col shadow-lg",
        className
      )}
    >
      {children}
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
        "bg-muted relative flex flex-col items-center justify-center gap-3 p-4 overflow-y-auto",
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
