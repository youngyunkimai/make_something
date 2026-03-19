"use client";

import { Play } from "lucide-react";
import {
  GameFrame,
  BattleField,
  MenuPanel,
  TextBox,
  PokeballDivider,
} from "./game-frame";

interface StartScreenProps {
  onStart: () => void;
  loading?: boolean;
}

export function StartScreen({ onStart, loading }: StartScreenProps) {
  return (
    <GameFrame>
      <BattleField className="flex-1 gap-4">
        <div className="flex gap-3 items-end">
          <div className="w-12 h-12 bg-foreground rounded-lg" />
          <div className="w-16 h-[72px] bg-foreground rounded-xl" />
          <div className="w-12 h-12 bg-foreground rounded-lg" />
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">
            1세대 포켓몬 실루엣 퀴즈
          </p>
          <h1 className="text-xl font-bold">누구의 그 포켓몬?</h1>
        </div>
      </BattleField>

      <PokeballDivider />

      <MenuPanel>
        <TextBox className="mb-4">
          <p className="text-sm">야생의 퀴즈가 나타났다!</p>
          <p className="text-xs text-muted-foreground mt-1">
            5문제 / 4지선다 / 힌트 3회
          </p>
        </TextBox>

        <button
          type="button"
          onClick={onStart}
          disabled={loading}
          className="w-full border-2 border-foreground rounded-lg px-4 py-2.5 text-sm font-bold bg-card hover:bg-accent transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          {loading ? "로딩 중..." : "시작하기"}
        </button>
      </MenuPanel>
    </GameFrame>
  );
}
