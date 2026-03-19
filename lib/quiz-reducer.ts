import type { Pokemon } from "./pokemon";

export type GamePhase = "idle" | "loading" | "playing" | "feedback" | "result";

export interface QuizState {
  gamePhase: GamePhase;
  quizPokemon: Pokemon[];
  choicePool: Pokemon[];
  currentQuestion: number;
  score: number;
  combo: number;
  maxCombo: number;
  hintLevel: number;
  answers: AnswerRecord[];
  lastAnswerCorrect: boolean | null;
}

export interface AnswerRecord {
  pokemon: Pokemon;
  selectedId: number;
  correct: boolean;
  scoreEarned: number;
  hintUsed: number;
}

export type QuizAction =
  | { type: "START_LOADING" }
  | { type: "START_GAME"; quizPokemon: Pokemon[]; choicePool: Pokemon[] }
  | { type: "SELECT_ANSWER"; selectedId: number }
  | { type: "USE_HINT" }
  | { type: "NEXT_QUESTION" }
  | { type: "RESTART" };

const SCORE_BY_HINT: Record<number, number> = {
  0: 100,
  1: 70,
  2: 40,
  3: 20,
};

export const initialState: QuizState = {
  gamePhase: "idle",
  quizPokemon: [],
  choicePool: [],
  currentQuestion: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  hintLevel: 0,
  answers: [],
  lastAnswerCorrect: null,
};

export function getAvailableScore(hintLevel: number): number {
  return SCORE_BY_HINT[hintLevel] ?? 20;
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, gamePhase: "loading" };

    case "START_GAME":
      return {
        ...initialState,
        gamePhase: "playing",
        quizPokemon: action.quizPokemon,
        choicePool: action.choicePool,
      };

    case "SELECT_ANSWER": {
      const currentPokemon = state.quizPokemon[state.currentQuestion];
      const correct = action.selectedId === currentPokemon.id;
      const scoreEarned = correct ? getAvailableScore(state.hintLevel) : 0;
      const newCombo = correct ? state.combo + 1 : 0;
      const newMaxCombo = Math.max(state.maxCombo, newCombo);

      const answer: AnswerRecord = {
        pokemon: currentPokemon,
        selectedId: action.selectedId,
        correct,
        scoreEarned,
        hintUsed: state.hintLevel,
      };

      return {
        ...state,
        gamePhase: "feedback",
        score: state.score + scoreEarned,
        combo: newCombo,
        maxCombo: newMaxCombo,
        lastAnswerCorrect: correct,
        answers: [...state.answers, answer],
      };
    }

    case "USE_HINT": {
      if (state.hintLevel >= 3) return state;
      return {
        ...state,
        hintLevel: state.hintLevel + 1,
      };
    }

    case "NEXT_QUESTION": {
      const nextQuestion = state.currentQuestion + 1;
      if (nextQuestion >= state.quizPokemon.length) {
        return { ...state, gamePhase: "result" };
      }
      return {
        ...state,
        gamePhase: "playing",
        currentQuestion: nextQuestion,
        hintLevel: 0,
        lastAnswerCorrect: null,
      };
    }

    case "RESTART":
      return { ...initialState };

    default:
      return state;
  }
}
