import { describe, it, expect } from "vitest";
import {
  quizReducer,
  initialState,
  getAvailableScore,
  type QuizState,
} from "./quiz-reducer";
import { MOCK_QUIZ_POKEMON, MOCK_CHOICE_POOL } from "./test-helpers";

function stateWithGame(overrides?: Partial<QuizState>): QuizState {
  return {
    ...initialState,
    gamePhase: "playing",
    quizPokemon: MOCK_QUIZ_POKEMON,
    choicePool: MOCK_CHOICE_POOL,
    ...overrides,
  };
}

describe("quizReducer", () => {
  describe("START_GAME", () => {
    it("should set gamePhase to playing and currentQuestion to 0", () => {
      const state = quizReducer(initialState, {
        type: "START_GAME",
        quizPokemon: MOCK_QUIZ_POKEMON,
        choicePool: MOCK_CHOICE_POOL,
      });

      expect(state.gamePhase).toBe("playing");
      expect(state.currentQuestion).toBe(0);
      expect(state.quizPokemon).toHaveLength(5);
      expect(state.score).toBe(0);
      expect(state.combo).toBe(0);
    });
  });

  describe("SELECT_ANSWER — correct", () => {
    it("should add score +100 and combo +1", () => {
      const state = stateWithGame();
      // First pokemon is MOCK_PIKACHU (id: 25)
      const next = quizReducer(state, { type: "SELECT_ANSWER", selectedId: 25 });

      expect(next.gamePhase).toBe("feedback");
      expect(next.score).toBe(100);
      expect(next.combo).toBe(1);
      expect(next.lastAnswerCorrect).toBe(true);
    });

    it("should add score +70 with hint level 1", () => {
      const state = stateWithGame({ hintLevel: 1 });
      const next = quizReducer(state, { type: "SELECT_ANSWER", selectedId: 25 });

      expect(next.score).toBe(70);
      expect(next.combo).toBe(1);
    });
  });

  describe("SELECT_ANSWER — wrong", () => {
    it("should add score +0 and combo = 0", () => {
      const state = stateWithGame({ combo: 2 });
      const next = quizReducer(state, { type: "SELECT_ANSWER", selectedId: 999 });

      expect(next.score).toBe(0);
      expect(next.combo).toBe(0);
      expect(next.lastAnswerCorrect).toBe(false);
    });

    it("should track maxCombo from before reset", () => {
      const state = stateWithGame({ combo: 3, maxCombo: 3 });
      const next = quizReducer(state, { type: "SELECT_ANSWER", selectedId: 999 });

      expect(next.combo).toBe(0);
      expect(next.maxCombo).toBe(3);
    });
  });

  describe("USE_HINT", () => {
    it("should increment hintLevel 1→2→3", () => {
      let state = stateWithGame();

      state = quizReducer(state, { type: "USE_HINT" });
      expect(state.hintLevel).toBe(1);

      state = quizReducer(state, { type: "USE_HINT" });
      expect(state.hintLevel).toBe(2);

      state = quizReducer(state, { type: "USE_HINT" });
      expect(state.hintLevel).toBe(3);
    });

    it("should not exceed hintLevel 3", () => {
      const state = stateWithGame({ hintLevel: 3 });
      const next = quizReducer(state, { type: "USE_HINT" });

      expect(next.hintLevel).toBe(3);
    });
  });

  describe("NEXT_QUESTION", () => {
    it("should increment currentQuestion and reset hintLevel", () => {
      const state = stateWithGame({
        gamePhase: "feedback",
        currentQuestion: 0,
        hintLevel: 2,
      });
      const next = quizReducer(state, { type: "NEXT_QUESTION" });

      expect(next.gamePhase).toBe("playing");
      expect(next.currentQuestion).toBe(1);
      expect(next.hintLevel).toBe(0);
    });

    it("should transition to result after 5th question", () => {
      const state = stateWithGame({
        gamePhase: "feedback",
        currentQuestion: 4,
      });
      const next = quizReducer(state, { type: "NEXT_QUESTION" });

      expect(next.gamePhase).toBe("result");
    });
  });

  describe("RESTART", () => {
    it("should reset all state", () => {
      const state = stateWithGame({
        score: 300,
        combo: 3,
        maxCombo: 3,
        currentQuestion: 4,
        gamePhase: "result",
      });
      const next = quizReducer(state, { type: "RESTART" });

      expect(next).toEqual(initialState);
    });
  });
});

describe("getAvailableScore", () => {
  it("should return correct score per hint level", () => {
    expect(getAvailableScore(0)).toBe(100);
    expect(getAvailableScore(1)).toBe(70);
    expect(getAvailableScore(2)).toBe(40);
    expect(getAvailableScore(3)).toBe(20);
  });
});
