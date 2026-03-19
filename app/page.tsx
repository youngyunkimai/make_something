"use client";

import { useReducer, useCallback, useRef, useState } from "react";
import { quizReducer, initialState, getAvailableScore } from "@/lib/quiz-reducer";
import { getRandomPokemon, getPokemonChoices } from "@/lib/pokeapi";
import type { Pokemon } from "@/lib/pokemon";
import { StartScreen } from "@/components/quiz/start-screen";
import { QuizScreen } from "@/components/quiz/quiz-screen";
import { ResultScreen } from "@/components/quiz/result-screen";

const FEEDBACK_DELAY = 600;

export default function Page() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [choices, setChoices] = useState<Pokemon[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateChoices = useCallback(
    (pokemon: Pokemon, pool: Pokemon[]) => {
      return getPokemonChoices(pokemon, 4, pool);
    },
    []
  );

  const handleStart = useCallback(async () => {
    dispatch({ type: "START_LOADING" });
    const pokemon = await getRandomPokemon(5);
    dispatch({ type: "START_GAME", quizPokemon: pokemon, choicePool: pokemon });
    setChoices(generateChoices(pokemon[0], pokemon));
    setSelectedId(null);
  }, [generateChoices]);

  const handleSelectAnswer = useCallback(
    (pokemonId: number) => {
      if (state.gamePhase !== "playing") return;

      setSelectedId(pokemonId);
      dispatch({ type: "SELECT_ANSWER", selectedId: pokemonId });

      // Auto-advance after feedback delay
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      feedbackTimer.current = setTimeout(() => {
        const nextQuestion = state.currentQuestion + 1;
        dispatch({ type: "NEXT_QUESTION" });

        if (nextQuestion < state.quizPokemon.length) {
          setChoices(
            generateChoices(
              state.quizPokemon[nextQuestion],
              state.quizPokemon
            )
          );
          setSelectedId(null);
        }
      }, FEEDBACK_DELAY);
    },
    [state.gamePhase, state.currentQuestion, state.quizPokemon, generateChoices]
  );

  const handleUseHint = useCallback(() => {
    dispatch({ type: "USE_HINT" });
  }, []);

  const handleRetry = useCallback(async () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    dispatch({ type: "RESTART" });
    // Start new game immediately
    dispatch({ type: "START_LOADING" });
    const pokemon = await getRandomPokemon(5);
    dispatch({ type: "START_GAME", quizPokemon: pokemon, choicePool: pokemon });
    setChoices(generateChoices(pokemon[0], pokemon));
    setSelectedId(null);
  }, [generateChoices]);

  const currentPokemon = state.quizPokemon[state.currentQuestion];

  if (state.gamePhase === "idle" || state.gamePhase === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <StartScreen
          onStart={handleStart}
          loading={state.gamePhase === "loading"}
        />
      </main>
    );
  }

  if (state.gamePhase === "result") {
    const wrongAnswers = state.answers.filter((a) => !a.correct);
    const correctCount = state.answers.filter((a) => a.correct).length;

    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <ResultScreen
          totalScore={state.score}
          correctCount={correctCount}
          totalQuestions={state.quizPokemon.length}
          maxCombo={state.maxCombo}
          wrongAnswers={wrongAnswers}
          onRetry={handleRetry}
        />
      </main>
    );
  }

  // playing or feedback
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <QuizScreen
        pokemon={currentPokemon}
        choices={choices}
        questionNumber={state.currentQuestion + 1}
        totalQuestions={state.quizPokemon.length}
        score={state.score}
        combo={state.combo}
        hintLevel={state.hintLevel}
        gamePhase={state.gamePhase}
        lastAnswerCorrect={state.lastAnswerCorrect}
        selectedId={selectedId}
        onSelectAnswer={handleSelectAnswer}
        onUseHint={handleUseHint}
      />
    </main>
  );
}
