"use client";

import { Play } from "lucide-react";
import {
  GameFrame,
  BattleField,
  MenuPanel,
  TextBox,
  PokeballDivider,
  type ViewMode,
} from "./game-frame";
import { PokeballSvg } from "./pokeball-svg";

interface StartScreenProps {
  onStart: () => void;
  loading?: boolean;
  viewMode: ViewMode;
  onToggleView: () => void;
}

export function StartScreen({ onStart, loading, viewMode, onToggleView }: StartScreenProps) {
  return (
    <GameFrame viewMode={viewMode} onToggleView={onToggleView}>
      <BattleField className="flex-1 gap-4">
        {/* Pokeball hero image */}
        <PokeballSvg size={140} />

        {/* Title */}
        <div className="text-center">
          <h1 className="text-xl font-bold">포켓몬 마스터 퀴즈</h1>
          <p className="text-xs text-muted-foreground mt-1">
            1세대 포켓몬 151종
          </p>
        </div>
      </BattleField>

      <PokeballDivider />

      <MenuPanel>
        <TextBox className="mb-4">
          <p className="text-sm font-bold">포켓몬 마스터를 찾아라!</p>
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
