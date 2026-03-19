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

const ARTWORK_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

// Iconic Gen 1 pokemon for the title screen
const HERO_POKEMON = [
  { id: 6, name: "리자몽" },   // Charizard
  { id: 25, name: "피카츄" },  // Pikachu (center, largest)
  { id: 150, name: "뮤츠" },   // Mewtwo
];

export function StartScreen({ onStart, loading }: StartScreenProps) {
  return (
    <GameFrame>
      <BattleField className="flex-1 gap-3">
        {/* Hero pokemon silhouettes */}
        <div className="flex items-end justify-center gap-1">
          <img
            src={`${ARTWORK_BASE}/${HERO_POKEMON[0].id}.png`}
            alt={HERO_POKEMON[0].name}
            className="w-[72px] h-[72px] object-contain"
            style={{ filter: "brightness(0)" }}
          />
          <img
            src={`${ARTWORK_BASE}/${HERO_POKEMON[1].id}.png`}
            alt={HERO_POKEMON[1].name}
            className="w-[100px] h-[100px] object-contain -mb-1"
            style={{ filter: "brightness(0)" }}
          />
          <img
            src={`${ARTWORK_BASE}/${HERO_POKEMON[2].id}.png`}
            alt={HERO_POKEMON[2].name}
            className="w-[72px] h-[72px] object-contain"
            style={{ filter: "brightness(0)" }}
          />
        </div>

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
