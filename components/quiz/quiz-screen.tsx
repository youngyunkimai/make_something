"use client";

import { Check, X } from "lucide-react";
import {
  GameFrame,
  BattleField,
  MenuPanel,
  TextBox,
  PokeballDivider,
} from "./game-frame";
import { StatusBox, ScoreBar, ProgressDots, ComboDisplay } from "./status-box";
import { SilhouetteImage } from "./silhouette-image";
import { ChoiceButton, type ChoiceState } from "./choice-button";
import { HintPanel } from "./hint-panel";
import type { Pokemon } from "@/lib/pokemon";
import { formatPokemonName } from "@/lib/pokemon";
import { getAvailableScore } from "@/lib/quiz-reducer";
import type { GamePhase } from "@/lib/quiz-reducer";

interface QuizScreenProps {
  pokemon: Pokemon;
  choices: Pokemon[];
  questionNumber: number;
  totalQuestions: number;
  score: number;
  combo: number;
  hintLevel: number;
  gamePhase: GamePhase;
  lastAnswerCorrect: boolean | null;
  selectedId: number | null;
  onSelectAnswer: (pokemonId: number) => void;
  onUseHint: () => void;
}

export function QuizScreen({
  pokemon,
  choices,
  questionNumber,
  totalQuestions,
  score,
  combo,
  hintLevel,
  gamePhase,
  lastAnswerCorrect,
  selectedId,
  onSelectAnswer,
  onUseHint,
}: QuizScreenProps) {
  const isFeedback = gamePhase === "feedback";
  const silhouetteState = isFeedback
    ? "revealed"
    : hintLevel >= 3
      ? "half"
      : "hidden";

  const availableScore = getAvailableScore(hintLevel);
  const scoreEarned = lastAnswerCorrect ? availableScore : 0;

  function getChoiceState(choice: Pokemon): ChoiceState {
    if (!isFeedback) return "idle";
    if (choice.id === pokemon.id) return "correct";
    if (choice.id === selectedId) return "wrong";
    return "disabled";
  }

  return (
    <GameFrame>
      {/* Top status bar — fixed at top */}
      <div className="w-full flex items-center justify-between px-4 py-2 bg-muted shrink-0 border-b border-border">
        <StatusBox className="flex items-center gap-2 py-1 px-2">
          <span className="text-xs font-bold">
            {questionNumber} / {totalQuestions}
          </span>
          <ProgressDots total={totalQuestions} filled={questionNumber} />
        </StatusBox>

        <StatusBox className="text-right py-1 px-2">
          <div className="flex items-center gap-2">
            <ComboDisplay combo={combo} />
            <span className="text-sm font-bold">{score}점</span>
          </div>
          <ScoreBar
            percentage={(score / (totalQuestions * 100)) * 100}
            className="mt-1 w-[80px]"
          />
        </StatusBox>
      </div>

      {/* Battle field — pokemon image area, larger */}
      <BattleField className="h-[320px] flex-none">
        <SilhouetteImage
          src={pokemon.imageUrl}
          pokemonName={formatPokemonName(pokemon)}
          state={silhouetteState}
          className="w-[220px] h-[220px]"
        />

        {/* Pokemon name (shown on feedback) */}
        {isFeedback && (
          <span className="text-sm font-bold">
            {formatPokemonName(pokemon)}
          </span>
        )}

        {/* Hint text display */}
        {!isFeedback && (
          <HintPanel pokemon={pokemon} hintLevel={hintLevel} />
        )}
      </BattleField>

      <PokeballDivider />

      {/* Menu panel — fixed height message area + choices at bottom */}
      <MenuPanel className="flex-1 flex flex-col">
        {/* Fixed-height feedback/hint area — prevents choices from shifting */}
        <div className="h-[40px] mb-2 flex items-center">
          {isFeedback && lastAnswerCorrect && (
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <p className="font-bold text-sm">정답!</p>
              <p className="text-xs text-muted-foreground">+{scoreEarned} 획득!</p>
            </div>
          )}
          {isFeedback && !lastAnswerCorrect && (
            <div className="flex items-center gap-2">
              <X className="w-4 h-4 shrink-0" />
              <p className="font-bold text-sm">오답!</p>
              <p className="text-xs text-muted-foreground">정답은 {formatPokemonName(pokemon)}</p>
            </div>
          )}
          {!isFeedback && (
            <div className="w-full flex items-center justify-end">
              <button
                type="button"
                onClick={onUseHint}
                disabled={hintLevel >= 3}
                className="border rounded px-3 py-1 text-xs flex items-center gap-1 bg-card hover:bg-accent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                힌트 {3 - hintLevel}/3
              </button>
            </div>
          )}
        </div>

        {/* Choice grid — always at the same position */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {choices.map((choice) => (
            <ChoiceButton
              key={choice.id}
              pokemon={choice}
              state={getChoiceState(choice)}
              selected={choice.id === selectedId}
              onClick={() => onSelectAnswer(choice.id)}
            />
          ))}
        </div>

        {/* Auto-advance message */}
        {isFeedback && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            다음 문제로 자동 전환...
          </p>
        )}
      </MenuPanel>
    </GameFrame>
  );
}
