import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Page from "./page";

// Mock PokeAPI — always return deterministic data (keep real GENERATIONS constant)
vi.mock("@/lib/pokeapi", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/pokeapi")>();
  return {
    ...actual,
    getRandomPokemon: vi.fn().mockResolvedValue([
      { id: 25, nameKo: "피카츄", nameEn: "Pikachu", types: ["electric"], imageUrl: "https://example.com/25.png" },
      { id: 4, nameKo: "파이리", nameEn: "Charmander", types: ["fire"], imageUrl: "https://example.com/4.png" },
      { id: 7, nameKo: "꼬부기", nameEn: "Squirtle", types: ["water"], imageUrl: "https://example.com/7.png" },
      { id: 1, nameKo: "이상해씨", nameEn: "Bulbasaur", types: ["grass", "poison"], imageUrl: "https://example.com/1.png" },
      { id: 39, nameKo: "푸린", nameEn: "Jigglypuff", types: ["normal", "fairy"], imageUrl: "https://example.com/39.png" },
    ]),
    getPokemonChoices: vi.fn().mockImplementation((correct: any) => {
      const others = [
        { id: 26, nameKo: "라이츄", nameEn: "Raichu", types: ["electric"], imageUrl: "https://example.com/26.png" },
        { id: 94, nameKo: "팬텀", nameEn: "Gengar", types: ["ghost"], imageUrl: "https://example.com/94.png" },
        { id: 143, nameKo: "잠만보", nameEn: "Snorlax", types: ["normal"], imageUrl: "https://example.com/143.png" },
      ];
      return [correct, ...others];
    }),
    getTypeNameKo: vi.fn().mockImplementation((type: string) => {
      const map: Record<string, string> = { electric: "전기", fire: "불꽃", water: "물", grass: "풀", normal: "노말", poison: "독", fairy: "페어리" };
      return map[type] ?? type;
    }),
  };
});

// ─── Helper: 시작 화면에서 퀴즈 시작 ───
async function startQuiz(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /시작/i }));
}

// ─── Helper: 5문제 모두 오답으로 통과하여 결과 화면 도달 ───
async function reachResultScreen(user: ReturnType<typeof userEvent.setup>) {
  await startQuiz(user);
  for (let i = 0; i < 5; i++) {
    await user.click(screen.getByRole("button", { name: /라이츄 \(Raichu\)/i }));
    if (i < 4) {
      await screen.findByText(`${i + 2} / 5`);
    }
  }
  await screen.findByText(/퀴즈 완료/);
}

// ═══════════════════════════════════════════
// 메인 화면
// ═══════════════════════════════════════════

describe("메인 화면", () => {
  it("포켓볼 일러스트 + 타이틀 + 부제 + 규칙 안내 + 시작 버튼이 표시된다", () => {
    render(<Page />);

    // 포켓볼 SVG 일러스트
    expect(screen.getByLabelText("포켓볼")).toBeInTheDocument();

    // 타이틀 + 부제
    expect(screen.getByText("포켓몬 마스터 퀴즈")).toBeInTheDocument();
    expect(screen.getByText("1세대 포켓몬 151종")).toBeInTheDocument();

    // 규칙 안내
    expect(screen.getByText("포켓몬 마스터를 찾아라!")).toBeInTheDocument();
    expect(screen.getByText(/5문제/)).toBeInTheDocument();
    expect(screen.getByText(/4지선다/)).toBeInTheDocument();
    expect(screen.getByText(/힌트 3회/)).toBeInTheDocument();

    // 시작 버튼
    expect(screen.getByRole("button", { name: /시작/i })).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════
// QUIZ-001: 퀴즈 시작
// ═══════════════════════════════════════════

describe("QUIZ-001: 퀴즈 시작", () => {
  it("시작 버튼 클릭 → 실루엣 이미지 + 보기 4개 + 문제 번호 + 점수 표시", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await startQuiz(user);

    // 실루엣 이미지 표시
    expect(screen.getByRole("img", { name: /실루엣/i })).toBeInTheDocument();

    // 보기 4개 표시 (aria-label에 한국어+영어 병기)
    const choices = screen.getAllByRole("button", { name: /\(.*\)/i });
    expect(choices).toHaveLength(4);

    // 문제 번호 + 점수 상단 고정
    expect(screen.getByText("1 / 5")).toBeInTheDocument();
    expect(screen.getByText(/0점/)).toBeInTheDocument();

    // 보기에 한국어 + 영어 (sr-only 텍스트)
    expect(screen.getByText(/피카츄 \(Pikachu\)/)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════
// QUIZ-002: 보기에 정답 포함 검증
// ═══════════════════════════════════════════

describe("QUIZ-002: 보기에 정답 포함 검증", () => {
  it("현재 실루엣의 포켓몬 이름이 4개 보기 중 하나에 표시된다", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await startQuiz(user);

    const choices = screen.getAllByRole("button", { name: /\(.*\)/i });
    const choiceLabels = choices.map((c) => c.getAttribute("aria-label"));
    expect(choiceLabels.some((l) => l?.includes("피카츄 (Pikachu)"))).toBe(true);
    expect(choices).toHaveLength(4);
  });
});

// ═══════════════════════════════════════════
// QUIZ-003: 정답 선택
// ═══════════════════════════════════════════

describe("QUIZ-003: 정답 선택", () => {
  it("정답 클릭 → 컬러 이미지 + 초록색 '정답!' + 점수 표시", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await startQuiz(user);
    await user.click(screen.getByRole("button", { name: /피카츄 \(Pikachu\)/i }));

    // 컬러 이미지 전환 (alt가 포켓몬 이름으로 변경)
    const img = screen.getByRole("img", { name: /피카츄/i });
    expect(img).toHaveAttribute("data-state", "revealed");

    // "정답!" 텍스트 (초록색 영역)
    expect(screen.getByText("정답!")).toBeInTheDocument();

    // 정답 보기 — 초록색 강조 (data-state="correct")
    const correctBtn = screen.getByRole("button", { name: /피카츄 \(Pikachu\)/i });
    expect(correctBtn).toHaveAttribute("data-state", "correct");

    // 나머지 보기 — 흐리게 (data-state="disabled")
    const otherBtn = screen.getByRole("button", { name: /라이츄 \(Raichu\)/i });
    expect(otherBtn).toHaveAttribute("data-state", "disabled");

    // 점수 표시
    expect(screen.getByText(/100점/)).toBeInTheDocument();

    // 이미지 아래 포켓몬 이름 표시 (보기 sr-only + 이름 표시로 복수 존재)
    const nameTexts = screen.getAllByText(/피카츄 \(Pikachu\)/);
    expect(nameTexts.length).toBeGreaterThanOrEqual(2);
  });

  it("연속 정답 시 콤보 표시", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await startQuiz(user);

    // 1문제 정답
    await user.click(screen.getByRole("button", { name: /피카츄 \(Pikachu\)/i }));
    await screen.findByText("2 / 5");

    // 2문제 정답
    await user.click(screen.getByRole("button", { name: /파이리 \(Charmander\)/i }));

    // 2 콤보 표시
    expect(screen.getByText(/2 콤보/)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════
// QUIZ-004: 정답 선택 후 다음 문제 이동
// ═══════════════════════════════════════════

describe("QUIZ-004: 정답 선택 후 다음 문제 이동", () => {
  it("자동 전환 → 문제 번호 갱신 + 새 실루엣 + 보기 4개", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await startQuiz(user);
    await user.click(screen.getByRole("button", { name: /피카츄 \(Pikachu\)/i }));

    // 자동 전환 후 다음 문제
    expect(await screen.findByText("2 / 5")).toBeInTheDocument();

    // 새 실루엣 표시
    expect(screen.getByRole("img", { name: /실루엣/i })).toBeInTheDocument();

    // 보기 4개 표시
    const choices = screen.getAllByRole("button", { name: /\(.*\)/i });
    expect(choices).toHaveLength(4);
  });
});

// ═══════════════════════════════════════════
// QUIZ-005: 오답 선택
// ═══════════════════════════════════════════

describe("QUIZ-005: 오답 선택", () => {
  it("오답 클릭 → 빨간색 오답 표시 + 정답 비공개 + 컬러 이미지", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await startQuiz(user);
    await user.click(screen.getByRole("button", { name: /라이츄 \(Raichu\)/i }));

    // 오답 표시 — 빨간색 (data-state="wrong")
    const wrongButton = screen.getByRole("button", { name: /라이츄 \(Raichu\)/i });
    expect(wrongButton).toHaveAttribute("data-state", "wrong");

    // 정답은 강조하지 않음 (disabled 상태로 흐리게)
    const correctButton = screen.getByRole("button", { name: /피카츄 \(Pikachu\)/i });
    expect(correctButton).toHaveAttribute("data-state", "disabled");

    // "오답!" 텍스트 (빨간색 영역)
    expect(screen.getByText("오답!")).toBeInTheDocument();

    // 컬러 이미지 전환
    const img = screen.getByRole("img", { name: /피카츄/i });
    expect(img).toHaveAttribute("data-state", "revealed");

    // 점수 변동 없음
    expect(screen.getByText(/0점/)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════
// QUIZ-006: 오답 선택 시 콤보 초기화
// ═══════════════════════════════════════════

describe("QUIZ-006: 오답 선택 시 콤보 초기화", () => {
  it("콤보 텍스트가 화면에서 사라진다", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await startQuiz(user);

    // 1문제 정답 → 콤보 시작
    await user.click(screen.getByRole("button", { name: /피카츄 \(Pikachu\)/i }));
    await screen.findByText("2 / 5");

    // 2문제 오답
    await user.click(screen.getByRole("button", { name: /라이츄 \(Raichu\)/i }));

    // 콤보 텍스트 사라짐
    expect(screen.queryByText(/콤보/)).not.toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════
// QUIZ-007: 힌트 1단계 — 타입 공개
// ═══════════════════════════════════════════

describe("QUIZ-007: 힌트 1단계 — 타입 공개", () => {
  it("힌트 1회 → 타입 표시 + 점수 감소 표시 (100→70 -30)", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await startQuiz(user);
    await user.click(screen.getByRole("button", { name: /힌트/i }));

    // 타입 표시
    expect(screen.getByText(/전기 타입/)).toBeInTheDocument();

    // 점수 감소 표시
    expect(screen.getByText(/70점/)).toBeInTheDocument();
    expect(screen.getByText(/-30/)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════
// QUIZ-008: 힌트 2단계 — 도감번호 공개
// ═══════════════════════════════════════════

describe("QUIZ-008: 힌트 2단계 — 도감번호 공개", () => {
  it("힌트 2회 → 타입 + 도감번호 + 점수 감소 표시 (100→40 -60)", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await startQuiz(user);
    await user.click(screen.getByRole("button", { name: /힌트/i }));
    await user.click(screen.getByRole("button", { name: /힌트/i }));

    // 타입 + 도감번호
    expect(screen.getByText(/전기 타입/)).toBeInTheDocument();
    expect(screen.getByText(/도감번호: #025/)).toBeInTheDocument();

    // 점수 감소 표시
    expect(screen.getByText(/40점/)).toBeInTheDocument();
    expect(screen.getByText(/-60/)).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════
// QUIZ-009: 힌트 3단계 — 실루엣 일부 공개
// ═══════════════════════════════════════════

describe("QUIZ-009: 힌트 3단계 — 실루엣 일부 공개", () => {
  it("힌트 3회 → 실루엣 밝기 50% + 점수 감소 + 힌트 버튼 비활성화", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await startQuiz(user);
    await user.click(screen.getByRole("button", { name: /힌트/i }));
    await user.click(screen.getByRole("button", { name: /힌트/i }));
    await user.click(screen.getByRole("button", { name: /힌트/i }));

    // 실루엣 반쯤 공개
    const img = screen.getByRole("img", { name: /실루엣/i });
    expect(img).toHaveAttribute("data-state", "half");

    // 점수 감소 표시
    expect(screen.getByText(/20점/)).toBeInTheDocument();
    expect(screen.getByText(/-80/)).toBeInTheDocument();

    // 힌트 버튼 비활성화
    const hintButton = screen.getByRole("button", { name: /힌트/i });
    expect(hintButton).toBeDisabled();
  });
});

// ═══════════════════════════════════════════
// QUIZ-010: 결과 요약
// ═══════════════════════════════════════════

describe("QUIZ-010: 결과 요약", () => {
  it("총점, 정답률, 최대 콤보, 틀린 포켓몬, 다시 하기, 홈화면 표시", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await startQuiz(user);

    // 5문제: Q1~Q4 정답, Q5 오답
    await user.click(screen.getByRole("button", { name: /피카츄 \(Pikachu\)/i }));
    await screen.findByText("2 / 5");

    await user.click(screen.getByRole("button", { name: /파이리 \(Charmander\)/i }));
    await screen.findByText("3 / 5");

    await user.click(screen.getByRole("button", { name: /꼬부기 \(Squirtle\)/i }));
    await screen.findByText("4 / 5");

    await user.click(screen.getByRole("button", { name: /이상해씨 \(Bulbasaur\)/i }));
    await screen.findByText("5 / 5");

    await user.click(screen.getByRole("button", { name: /라이츄 \(Raichu\)/i }));

    // 결과 화면 (sr-only 텍스트로 검증)
    expect(await screen.findByText(/총점: 400점/)).toBeInTheDocument();
    expect(screen.getByText(/정답률: 4 \/ 5/)).toBeInTheDocument();
    expect(screen.getByText(/최대 콤보: 4/)).toBeInTheDocument();

    // 틀린 포켓몬 목록
    expect(screen.getByText(/푸린 \(Jigglypuff\)/)).toBeInTheDocument();

    // 다시 하기 + 홈화면 버튼
    expect(screen.getByRole("button", { name: /다시 하기/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /홈화면/i })).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════
// QUIZ-011: 다시 하기 — 바로 새 퀴즈 시작
// ═══════════════════════════════════════════

describe("QUIZ-011: 다시 하기 — 바로 새 퀴즈 시작", () => {
  it("다시 하기 클릭 → 홈 거치지 않고 바로 1/5, 0점, 새 실루엣 + 보기 4개", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await reachResultScreen(user);

    // 다시 하기 클릭
    await user.click(screen.getByRole("button", { name: /다시 하기/i }));

    // 홈 화면이 아닌 퀴즈 화면으로 바로 이동 (시작 버튼이 없어야 함)
    expect(screen.queryByText("포켓몬 마스터 퀴즈")).not.toBeInTheDocument();

    // 퀴즈 초기화 확인
    expect(screen.getByText("1 / 5")).toBeInTheDocument();
    expect(screen.getByText(/0점/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /실루엣/i })).toBeInTheDocument();

    const choices = screen.getAllByRole("button", { name: /\(.*\)/i });
    expect(choices).toHaveLength(4);
  });
});

// ═══════════════════════════════════════════
// QUIZ-012: 홈화면 복귀
// ═══════════════════════════════════════════

describe("QUIZ-012: 홈화면 복귀", () => {
  it("홈화면 클릭 → 메인 화면(포켓볼 + 시작 버튼) 표시", async () => {
    const user = userEvent.setup();
    render(<Page />);

    await reachResultScreen(user);

    // 홈화면 클릭
    await user.click(screen.getByRole("button", { name: /홈화면/i }));

    // 메인 화면 확인
    expect(screen.getByLabelText("포켓볼")).toBeInTheDocument();
    expect(screen.getByText("포켓몬 마스터 퀴즈")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /시작/i })).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════
// QUIZ-013: 세대 선택
// ═══════════════════════════════════════════

describe("QUIZ-013: 세대 선택", () => {
  it("기본값 1세대 → 2세대 클릭 시 부제와 선택 상태 변경", async () => {
    const user = userEvent.setup();
    render(<Page />);

    // 기본값: 1세대
    expect(screen.getByText("1세대 포켓몬 151종")).toBeInTheDocument();

    // 1세대 버튼이 선택된 상태
    const gen1Button = screen.getByRole("button", { name: /1세대/i });
    expect(gen1Button).toHaveAttribute("aria-pressed", "true");

    // 2세대 클릭
    await user.click(screen.getByRole("button", { name: /2세대/i }));

    // 부제 변경
    expect(screen.getByText("2세대 포켓몬 100종")).toBeInTheDocument();
    expect(screen.queryByText("1세대 포켓몬 151종")).not.toBeInTheDocument();

    // 2세대 버튼 선택 상태
    expect(screen.getByRole("button", { name: /2세대/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /1세대/i })).toHaveAttribute("aria-pressed", "false");
  });
});
