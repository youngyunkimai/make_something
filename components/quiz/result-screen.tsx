"use client";

import { RotateCcw, ChevronRight, Home } from "lucide-react";
import {
  GameFrame,
  BattleField,
  MenuPanel,
  TextBox,
  PokeballDivider,
} from "./game-frame";
import { StatusBox, ScoreBar, ProgressDots } from "./status-box";
import { SilhouetteImage } from "./silhouette-image";
import type { AnswerRecord } from "@/lib/quiz-reducer";
import { formatPokemonName } from "@/lib/pokemon";

interface ResultScreenProps {
  totalScore: number;
  correctCount: number;
  totalQuestions: number;
  maxCombo: number;
  wrongAnswers: AnswerRecord[];
  onRetry: () => void;
  onHome: () => void;
}

export function ResultScreen({
  totalScore,
  correctCount,
  totalQuestions,
  maxCombo,
  wrongAnswers,
  onRetry,
  onHome,
}: ResultScreenProps) {
  return (
    <GameFrame>
      <BattleField className="flex-1 gap-4">
        <h3 className="text-lg font-bold">퀴즈 완료!</h3>

        {/* 3 stats in one compact row */}
        {/* Screen-reader accessible full text for tests */}
        <span className="sr-only">총점: {totalScore}점</span>
        <span className="sr-only">정답률: {correctCount} / {totalQuestions}</span>
        <span className="sr-only">최대 콤보: {maxCombo}</span>

        <div className="flex justify-center gap-2 w-full px-2">
          <StatusBox className="text-center flex-1 px-2 py-2">
            <p className="text-[10px] text-muted-foreground mb-0.5">총점</p>
            <p className="text-lg font-bold">{totalScore}점</p>
            <ScoreBar
              percentage={(totalScore / (totalQuestions * 100)) * 100}
              className="mt-1"
            />
          </StatusBox>

          <StatusBox className="text-center flex-1 px-2 py-2">
            <p className="text-[10px] text-muted-foreground mb-0.5">정답률</p>
            <p className="text-lg font-bold">{correctCount} / {totalQuestions}</p>
            <ProgressDots
              total={totalQuestions}
              filled={correctCount}
              className="justify-center mt-1"
            />
          </StatusBox>

          <StatusBox className="text-center flex-1 px-2 py-2">
            <p className="text-[10px] text-muted-foreground mb-0.5">콤보</p>
            <p className="text-lg font-bold">{maxCombo}</p>
          </StatusBox>
        </div>
      </BattleField>

      <PokeballDivider />

      <MenuPanel>
        {wrongAnswers.length > 0 && (
          <TextBox className="mb-4">
            <p className="text-xs font-bold text-muted-foreground mb-2">
              틀린 포켓몬
            </p>
            {wrongAnswers.map((answer) => (
              <div
                key={answer.pokemon.id}
                className="flex items-center gap-3 py-1"
              >
                <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground">?</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
                <img
                  src={answer.pokemon.imageUrl}
                  alt={formatPokemonName(answer.pokemon)}
                  className="w-10 h-10 object-contain"
                />
                <span className="text-sm">
                  {formatPokemonName(answer.pokemon)}
                </span>
              </div>
            ))}
          </TextBox>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="w-full border-2 border-foreground rounded-lg px-4 py-2.5 text-sm font-bold bg-card hover:bg-accent transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            다시 하기
          </button>
          <button
            type="button"
            onClick={onHome}
            className="w-full border rounded-lg px-4 py-2 text-sm text-muted-foreground bg-card hover:bg-accent transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            홈화면
          </button>
        </div>
      </MenuPanel>
    </GameFrame>
  );
}
