import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Page from "./page";
import {
  MOCK_PIKACHU,
  MOCK_CHARMANDER,
  MOCK_SQUIRTLE,
  MOCK_BULBASAUR,
  MOCK_JIGGLYPUFF,
  MOCK_QUIZ_POKEMON,
  MOCK_CHOICE_POOL,
} from "@/lib/test-helpers";

// Mock PokeAPI — always return deterministic data
vi.mock("@/lib/pokeapi", () => ({
  getRandomPokemon: vi.fn().mockResolvedValue([
    // Quiz order: pikachu, charmander, squirtle, bulbasaur, jigglypuff
    { id: 25, nameKo: "피카츄", nameEn: "Pikachu", types: ["electric"], imageUrl: "https://example.com/25.png" },
    { id: 4, nameKo: "파이리", nameEn: "Charmander", types: ["fire"], imageUrl: "https://example.com/4.png" },
    { id: 7, nameKo: "꼬부기", nameEn: "Squirtle", types: ["water"], imageUrl: "https://example.com/7.png" },
    { id: 1, nameKo: "이상해씨", nameEn: "Bulbasaur", types: ["grass", "poison"], imageUrl: "https://example.com/1.png" },
    { id: 39, nameKo: "푸린", nameEn: "Jigglypuff", types: ["normal", "fairy"], imageUrl: "https://example.com/39.png" },
  ]),
  getPokemonChoices: vi.fn().mockImplementation((correct: any) => {
    // Return correct + 3 others, correct always first for deterministic testing
    const others = [
      { id: 26, nameKo: "라이츄", nameEn: "Raichu", types: ["electric"], imageUrl: "https://example.com/26.png" },
      { id: 94, nameKo: "팬텀", nameEn: "Gengar", types: ["ghost"], imageUrl: "https://example.com/94.png" },
      { id: 143, nameKo: "잠만보", nameEn: "Snorlax", types: ["normal"], imageUrl: "https://example.com/143.png" },
    ];
    return [correct, ...others];
  }),
  getTypeNameKo: vi.fn().mockImplementation((type: string) => {
    const map: Record<string, string> = { electric: "전기", fire: "불꽃", water: "물", grass: "풀", normal: "노말" };
    return map[type] ?? type;
  }),
}));

describe("QUIZ-001: 퀴즈 시작", () => {
  it("시작 버튼 클릭 → 실루엣 이미지 + 보기 4개 + 문제 번호 표시", async () => {
    const user = userEvent.setup();
    render(<Page />);

    const startButton = screen.getByRole("button", { name: /시작/i });
    await user.click(startButton);

    // 실루엣 이미지 표시
    expect(screen.getByRole("img", { name: /실루엣/i })).toBeInTheDocument();

    // 보기 4개 표시
    const choices = screen.getAllByRole("button", { name: /\(.*\)/i });
    expect(choices).toHaveLength(4);

    // 문제 번호 표시
    expect(screen.getByText("1 / 5")).toBeInTheDocument();

    // 보기에 한국어 + 영어 병기
    expect(screen.getByText(/피카츄 \(Pikachu\)/)).toBeInTheDocument();
  });
});

describe("QUIZ-002: 보기에 정답 포함 검증", () => {
  it("현재 실루엣의 포켓몬 이름이 4개 보기 중 하나에 표시된다", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /시작/i }));

    // 첫 문제는 피카츄 — 보기에 "피카츄 (Pikachu)" 포함
    const choices = screen.getAllByRole("button", { name: /\(.*\)/i });
    const choiceTexts = choices.map((c) => c.textContent);
    expect(choiceTexts.some((t) => t?.includes("피카츄 (Pikachu)"))).toBe(true);
    expect(choices).toHaveLength(4);
  });
});

describe("QUIZ-003: 정답 선택", () => {
  it("정답 클릭 → 컬러 이미지 + '정답!' + 점수 표시", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /시작/i }));
    await user.click(screen.getByRole("button", { name: /피카츄 \(Pikachu\)/i }));

    // 컬러 이미지 전환
    const img = screen.getByRole("img", { name: /피카츄/i });
    expect(img).toBeInTheDocument();

    // "정답!" 텍스트 표시
    expect(screen.getByText("정답!")).toBeInTheDocument();

    // 점수 표시
    expect(screen.getByText(/100점/)).toBeInTheDocument();
  });

  it("연속 정답 시 콤보 표시", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /시작/i }));

    // 1문제 정답
    await user.click(screen.getByRole("button", { name: /피카츄 \(Pikachu\)/i }));

    // 다음 문제로 전환 대기
    await screen.findByText("2 / 5");

    // 2문제 정답
    await user.click(screen.getByRole("button", { name: /파이리 \(Charmander\)/i }));

    // 2 콤보 표시
    expect(screen.getByText(/2 콤보/)).toBeInTheDocument();
  });
});

describe("QUIZ-004: 정답 선택 후 다음 문제 이동", () => {
  it("문제 번호 갱신 + 새 실루엣 + 보기 4개", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /시작/i }));
    await user.click(screen.getByRole("button", { name: /피카츄 \(Pikachu\)/i }));

    // 다음 문제로 전환
    expect(await screen.findByText("2 / 5")).toBeInTheDocument();

    // 새 실루엣 표시
    expect(screen.getByRole("img", { name: /실루엣/i })).toBeInTheDocument();

    // 보기 4개 표시
    const choices = screen.getAllByRole("button", { name: /\(.*\)/i });
    expect(choices).toHaveLength(4);
  });
});

describe("QUIZ-005: 오답 선택", () => {
  it("오답 클릭 → 오답 표시 + 정답 강조 + 컬러 이미지", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /시작/i }));

    // 오답 선택 (라이츄)
    await user.click(screen.getByRole("button", { name: /라이츄 \(Raichu\)/i }));

    // 오답 표시된 버튼
    const wrongButton = screen.getByRole("button", { name: /라이츄 \(Raichu\)/i });
    expect(wrongButton).toHaveAttribute("data-state", "wrong");

    // 정답 강조
    const correctButton = screen.getByRole("button", { name: /피카츄 \(Pikachu\)/i });
    expect(correctButton).toHaveAttribute("data-state", "correct");

    // 컬러 이미지 전환
    const img = screen.getByRole("img", { name: /피카츄/i });
    expect(img).toBeInTheDocument();

    // 점수 변동 없음
    expect(screen.getByText(/0점/)).toBeInTheDocument();
  });
});

describe("QUIZ-006: 오답 선택 시 콤보 초기화", () => {
  it("콤보 텍스트가 화면에서 사라진다", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /시작/i }));

    // 1문제 정답 → 콤보 시작
    await user.click(screen.getByRole("button", { name: /피카츄 \(Pikachu\)/i }));
    await screen.findByText("2 / 5");

    // 2문제 오답
    await user.click(screen.getByRole("button", { name: /라이츄 \(Raichu\)/i }));

    // 콤보 텍스트 사라짐
    expect(screen.queryByText(/콤보/)).not.toBeInTheDocument();
  });
});

describe("QUIZ-007: 힌트 1단계 — 타입 공개", () => {
  it("힌트 1회 → 타입 표시 + 획득 가능 70점", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /시작/i }));
    await user.click(screen.getByRole("button", { name: /힌트/i }));

    expect(screen.getByText(/전기 타입/)).toBeInTheDocument();
    expect(screen.getByText(/70점/)).toBeInTheDocument();
  });
});

describe("QUIZ-008: 힌트 2단계 — 도감번호 공개", () => {
  it("힌트 2회 → 도감번호 표시 + 획득 가능 40점", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /시작/i }));
    await user.click(screen.getByRole("button", { name: /힌트/i }));
    await user.click(screen.getByRole("button", { name: /힌트/i }));

    expect(screen.getByText(/도감번호: #025/)).toBeInTheDocument();
    expect(screen.getByText(/40점/)).toBeInTheDocument();
  });
});

describe("QUIZ-009: 힌트 3단계 — 실루엣 일부 공개", () => {
  it("힌트 3회 → 실루엣 밝기 50% + 획득 가능 20점 + 힌트 버튼 비활성화", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /시작/i }));
    await user.click(screen.getByRole("button", { name: /힌트/i }));
    await user.click(screen.getByRole("button", { name: /힌트/i }));
    await user.click(screen.getByRole("button", { name: /힌트/i }));

    // 실루엣 반쯤 공개
    const img = screen.getByRole("img", { name: /실루엣/i });
    expect(img).toHaveAttribute("data-state", "half");

    // 획득 가능 점수
    expect(screen.getByText(/20점/)).toBeInTheDocument();

    // 힌트 버튼 비활성화
    const hintButton = screen.getByRole("button", { name: /힌트/i });
    expect(hintButton).toBeDisabled();
  });
});

describe("QUIZ-010: 결과 요약", () => {
  it("총점, 정답률, 최대 콤보, 틀린 포켓몬, 다시 하기 표시", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /시작/i }));

    // 5문제 풀기: 4정답 1오답
    // Q1: 피카츄 정답
    await user.click(screen.getByRole("button", { name: /피카츄 \(Pikachu\)/i }));
    await screen.findByText("2 / 5");

    // Q2: 파이리 정답
    await user.click(screen.getByRole("button", { name: /파이리 \(Charmander\)/i }));
    await screen.findByText("3 / 5");

    // Q3: 꼬부기 정답
    await user.click(screen.getByRole("button", { name: /꼬부기 \(Squirtle\)/i }));
    await screen.findByText("4 / 5");

    // Q4: 이상해씨 정답
    await user.click(screen.getByRole("button", { name: /이상해씨 \(Bulbasaur\)/i }));
    await screen.findByText("5 / 5");

    // Q5: 푸린 오답 (라이츄 선택)
    await user.click(screen.getByRole("button", { name: /라이츄 \(Raichu\)/i }));

    // 결과 화면 — 힌트 미사용, Q1~Q4 정답(100점x4=400점), Q5 오답, 최대 콤보 4
    expect(await screen.findByText(/총점: 400점/)).toBeInTheDocument();
    expect(screen.getByText(/정답률: 4 \/ 5/)).toBeInTheDocument();
    expect(screen.getByText(/최대 콤보: 4/)).toBeInTheDocument();

    // 틀린 포켓몬 목록
    expect(screen.getByText(/푸린 \(Jigglypuff\)/)).toBeInTheDocument();

    // 다시 하기 버튼
    expect(screen.getByRole("button", { name: /다시 하기/i })).toBeInTheDocument();
  });
});

describe("QUIZ-011: 다시 하기 — 새 라운드 초기화", () => {
  it("다시 하기 클릭 → 1/5, 0점, 새 실루엣 + 보기 4개", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await user.click(screen.getByRole("button", { name: /시작/i }));

    // 5문제 모두 오답으로 빠르게 통과
    for (let i = 0; i < 5; i++) {
      await user.click(screen.getByRole("button", { name: /라이츄 \(Raichu\)/i }));
      if (i < 4) {
        await screen.findByText(`${i + 2} / 5`);
      }
    }

    // 결과 화면에서 다시 하기 클릭
    const retryButton = await screen.findByRole("button", { name: /다시 하기/i });
    await user.click(retryButton);

    // 초기화 확인
    expect(screen.getByText("1 / 5")).toBeInTheDocument();
    expect(screen.getByText(/0점/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /실루엣/i })).toBeInTheDocument();

    const choices = screen.getAllByRole("button", { name: /\(.*\)/i });
    expect(choices).toHaveLength(4);
  });
});
