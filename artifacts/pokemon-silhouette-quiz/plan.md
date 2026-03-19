# 누구의 그 포켓몬? 구현 계획

## Architecture Decisions

| 결정 사항 | 선택 | 사유 |
|-----------|------|------|
| 상태 관리 | React useState + useReducer | 단일 페이지 앱, 전역 상태 불필요. 퀴즈 상태가 한 컴포넌트 트리 안에서 완결됨 |
| 데이터 fetch | 클라이언트 fetch (PokeAPI 직접 호출) | 구현 간단, 서버 부담 없음, Vercel 무료 티어에 유리 |
| PokeAPI 호출 전략 | 게임 시작 시 5종 일괄 fetch | 문제마다 개별 fetch하면 UX 지연 발생. 시작 시 로딩 한 번으로 해결 |
| 실루엣 구현 | CSS filter: brightness(0) | 이미지 가공 없이 런타임에 실루엣 생성. transition으로 자연스러운 공개 효과 |
| 한국어 이름 | PokeAPI pokemon-species 엔드포인트 ko name | 별도 매핑 파일 불필요, API에서 직접 제공 |
| 페이지 구조 | 단일 페이지 (app/page.tsx) | 3개 화면(메인/퀴즈/결과)을 화면 상태로 전환, 라우팅 불필요 |

## Required Skills

| 스킬 | 용도 |
|------|------|
| vercel-react-best-practices | React/Next.js 성능 최적화 규칙 준수 |
| web-design-guidelines | Web Interface Guidelines 준수 |
| shadcn | shadcn/ui 컴포넌트 사용 규칙 준수 |

## UI Components

### 설치 필요

| 컴포넌트 | 설치 명령 |
|----------|-----------|
| Button | `bunx shadcn@latest add button` |

### 커스텀 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| GameFrame | 배틀 UI 외곽 프레임 (두꺼운 테두리 + 둥근 모서리) |
| BattleField | 상단 배틀 영역 (실루엣 이미지 + 힌트 표시) |
| StatusBox | HP바 스타일 상태 표시 (문제 번호, 점수바(인라인 div), 콤보) |
| ScoreBar | StatusBox 내부 점수 진행률 바 (인라인 div, height:4px). shadcn Progress 사용하지 않음 |
| MenuPanel | 하단 RPG 메뉴 패널 (보기 그리드 + 힌트 버튼) |
| TextBox | RPG 대화창 스타일 텍스트 박스 |
| PokeballDivider | 포켓볼 모양 구분선 |
| ChoiceButton | 2x2 그리드 보기 버튼 (화살표 커서 + 정답/오답 상태) |
| SilhouetteImage | 실루엣/컬러 전환 이미지 (CSS filter + transition) |
| ProgressDots | 문제 진행률 도트 (filled/empty) |

## 실행 프로토콜

- 각 task 시작 전, **참조 규칙**에 나열된 파일을 반드시 읽고 규칙을 준수하며 구현한다

## Tasks

### Task 0: PokeAPI 데이터 레이어 구현

- **시나리오**: 선행 작업 (QUIZ-001~011 전체의 데이터 의존성)
- **사유**: 모든 시나리오가 포켓몬 데이터(이름, 타입, 도감번호, 이미지 URL)에 의존하므로, 테스트에서 mock할 인터페이스를 먼저 정의해야 함
- **참조 규칙**:
  - `.claude/skills/vercel-react-best-practices/rules/async-parallel.md`
  - `.claude/skills/vercel-react-best-practices/rules/client-swr-dedup.md`
- **구현 대상**:
  - `lib/pokemon.ts` — Pokemon 타입 정의 (id, nameKo, nameEn, types, imageUrl)
  - `lib/pokeapi.ts` — PokeAPI fetch 함수 (getRandomPokemon, getPokemonChoices)
  - `lib/pokeapi.test.ts` — fetch 함수 단위 테스트
- **수용 기준**:
  - [ ] `getRandomPokemon(5)` → 1~151 범위의 중복 없는 포켓몬 5종 반환
  - [ ] 각 포켓몬에 한국어 이름(nameKo), 영어 이름(nameEn), 타입(types), 도감번호(id), 이미지 URL(imageUrl) 포함
  - [ ] `getPokemonChoices(correctPokemon, 4)` → 정답 1개 + 오답 3개로 구성된 보기 배열 반환
  - [ ] `bun run test` 통과
- **커밋**: `feat: PokeAPI 데이터 레이어 구현`

---

### Task 1: spec 테스트 생성

- **시나리오**: QUIZ-001 ~ QUIZ-011
- **참조 규칙**:
  - `CLAUDE.md` (spec 테스트 작성 규칙)
  - `artifacts/spec.yaml`
  - `artifacts/pokemon-silhouette-quiz/wireframe.html`
- **구현 대상**:
  - `app/quiz.spec.test.tsx` — spec.yaml의 11개 시나리오를 수용 기준 테스트로 작성
- **수용 기준**:
  - [ ] QUIZ-001~011 각 시나리오별 테스트 케이스 존재
  - [ ] getByRole, getByText 등 구현 비종속 셀렉터 사용
  - [ ] PokeAPI를 mock하여 테스트 데이터 주입 (lib/pokemon.ts의 Pokemon 인터페이스 기반)
  - [ ] 퀴즈 상태(reducer)는 직접 import하지 않고, 컴포넌트 렌더링 + 유저 인터랙션으로 간접 테스트
  - [ ] `bun run test` 실행 시 모든 spec 테스트가 fail (Red 상태)
- **커밋**: `test: spec 테스트 생성 (QUIZ-001~011)`

---

### Task 2: 퀴즈 상태 로직 구현

- **시나리오**: QUIZ-001 ~ QUIZ-011 (상태 전환 로직)
- **참조 규칙**:
  - `.claude/skills/vercel-react-best-practices/rules/rerender-extract-state.md`
  - `.claude/skills/vercel-react-best-practices/rules/rerender-stable-refs.md`
- **구현 대상**:
  - `lib/quiz-reducer.ts` — useReducer용 퀴즈 상태 머신 (gamePhase, currentQuestion, score, combo, maxCombo, hintLevel, answers)
  - `lib/quiz-reducer.test.ts` — reducer 단위 테스트
- **수용 기준**:
  - [ ] START_GAME → gamePhase: "playing", currentQuestion: 0
  - [ ] SELECT_ANSWER(correct) → score +100, combo +1
  - [ ] SELECT_ANSWER(correct, hint=1) → score +70, combo +1
  - [ ] SELECT_ANSWER(wrong) → score +0, combo = 0
  - [ ] USE_HINT → hintLevel 1→2→3, 3 이후 변화 없음
  - [ ] NEXT_QUESTION → currentQuestion +1, 5번째 문제 후 gamePhase: "result"
  - [ ] RESTART → 모든 상태 초기화
  - [ ] `bun run test` 통과
- **커밋**: `feat: 퀴즈 상태 reducer 구현`

---

### Task 3: shadcn 컴포넌트 설치 + 배틀 UI 커스텀 컴포넌트 구현

- **시나리오**: QUIZ-001 ~ QUIZ-011 (UI 레이어)
- **참조 규칙**:
  - `.claude/skills/shadcn/rules/styling.md`
  - `.claude/skills/shadcn/rules/composition.md`
  - `.claude/skills/shadcn/rules/icons.md`
  - `artifacts/pokemon-silhouette-quiz/wireframe.html`
- **구현 대상**:
  - shadcn Button 설치
  - `components/quiz/game-frame.tsx` — GameFrame, BattleField, MenuPanel, TextBox, PokeballDivider
  - `components/quiz/status-box.tsx` — StatusBox (ScoreBar 인라인 div 포함), ProgressDots
  - `components/quiz/choice-button.tsx` — ChoiceButton (idle/correct/wrong/disabled 상태)
  - `components/quiz/silhouette-image.tsx` — SilhouetteImage (brightness 0/0.5/1 전환)
- **lucide 아이콘 매핑**: flame(콤보), chevron-right(보기 커서), check(정답), x(오답), rotate-ccw(다시 하기), lightbulb(힌트), play(시작)
- **수용 기준**:
  - [ ] GameFrame이 wireframe의 game-frame 레이아웃과 일치 (두꺼운 테두리 + 배틀필드/메뉴 분리)
  - [ ] SilhouetteImage에 data-state="hidden" → filter:brightness(0), data-state="half" → filter:brightness(0.5), data-state="revealed" → filter:none
  - [ ] ChoiceButton에 data-state 속성 노출: "idle" / "correct" / "wrong" / "disabled". 각 상태별 테두리/배경/opacity 차이
  - [ ] PokeballDivider가 배틀필드와 메뉴 패널 사이에 렌더링
  - [ ] StatusBox 내부 ScoreBar가 인라인 div로 렌더링 (shadcn Progress 사용하지 않음)
  - [ ] `bun run test` 통과
- **커밋**: `feat: 배틀 UI 컴포넌트 구현`

---

### Task 4: 메인 화면 + 퀴즈 화면 조립

- **시나리오**: QUIZ-001, QUIZ-002, QUIZ-003, QUIZ-004, QUIZ-005, QUIZ-006
- **참조 규칙**:
  - `.claude/skills/vercel-react-best-practices/rules/rendering-client-leaf.md`
  - `.claude/skills/vercel-react-best-practices/rules/rerender-extract-state.md`
  - `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
- **구현 대상**:
  - `app/page.tsx` — 메인 페이지 (3개 화면 상태 전환)
  - `components/quiz/start-screen.tsx` — "야생의 퀴즈가 나타났다!" 메인 화면
  - `components/quiz/quiz-screen.tsx` — 퀴즈 진행 화면 (실루엣 + 보기 + 상태바 + 힌트 버튼 자리 배치. 힌트 로직은 Task 5에서 연결)
  - `components/quiz/feedback-overlay.tsx` — 정답/오답 피드백 (컬러 이미지 공개 + 메시지)
- **수용 기준**:
  - [ ] 시작 버튼 클릭 → 실루엣 이미지 + 보기 4개 + "1 / 5" 표시 (QUIZ-001)
  - [ ] 보기 4개 중 정답 포켓몬 이름이 반드시 포함 (QUIZ-002)
  - [ ] 정답 클릭 → 컬러 이미지 + 배틀필드에 포켓몬 이름 표시 + "정답!" + 점수 갱신 + 콤보 표시 (QUIZ-003)
  - [ ] 피드백 후 다음 문제로 전환, 문제 번호 갱신 (QUIZ-004)
  - [ ] 오답 클릭 → 오답 표시 + 정답 강조 + 컬러 이미지 + 배틀필드에 정답 포켓몬 이름 표시 (QUIZ-005)
  - [ ] 오답 시 콤보 텍스트 사라짐 (QUIZ-006)
  - [ ] `bun run test` 통과
- **커밋**: `feat: 메인 화면 + 퀴즈 화면 구현`

---

### Task 5: 힌트 시스템 구현

- **시나리오**: QUIZ-007, QUIZ-008, QUIZ-009
- **참조 규칙**:
  - `.claude/skills/shadcn/rules/styling.md`
  - `artifacts/pokemon-silhouette-quiz/wireframe.html`
- **구현 대상**:
  - `components/quiz/hint-panel.tsx` — 힌트 버튼 + 공개된 힌트 목록 + 획득 가능 점수
- **수용 기준**:
  - [ ] 힌트 1회 → 배틀필드 텍스트박스에 "전기 타입", 획득 가능 70점 (QUIZ-007)
  - [ ] 힌트 2회 → "도감번호: #025" 추가, 획득 가능 40점 (QUIZ-008)
  - [ ] 힌트 3회 → 실루엣 밝기 50%, 획득 가능 20점, 힌트 버튼 비활성화 (QUIZ-009)
  - [ ] `bun run test` 통과
- **커밋**: `feat: 3단계 힌트 시스템 구현`

---

### Task 6: 결과 요약 화면 구현

- **시나리오**: QUIZ-010, QUIZ-011
- **참조 규칙**:
  - `.claude/skills/shadcn/rules/composition.md`
  - `artifacts/pokemon-silhouette-quiz/wireframe.html`
- **구현 대상**:
  - `components/quiz/result-screen.tsx` — 결과 요약 (총점, 정답률, 최대 콤보, 틀린 포켓몬, 다시 하기)
- **수용 기준**:
  - [ ] "총점: 380점", "정답률: 4 / 5", "최대 콤보: 3" 표시 (QUIZ-010)
  - [ ] 틀린 포켓몬: 실루엣 → 화살표 → 컬러 이미지 + 이름 (QUIZ-010)
  - [ ] '다시 하기' 클릭 → "1 / 5", "0점", 새 실루엣 + 보기 4개 (QUIZ-011)
  - [ ] `bun run test` 통과
- **커밋**: `feat: 결과 요약 화면 구현`

---

### Task 7: 전체 통합 테스트 + 스타일 마무리

- **시나리오**: QUIZ-001 ~ QUIZ-011 전체
- **참조 규칙**:
  - `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
  - `.claude/skills/vercel-react-best-practices/rules/rendering-client-leaf.md`
  - `.claude/skills/vercel-react-best-practices/rules/bundle-dynamic-imports.md`
- **구현 대상**:
  - 모든 spec 테스트(quiz.spec.test.tsx) 통과 확인
  - 배틀 UI 스타일 마무리 (wireframe과 일치 여부)
  - Next.js Image 컴포넌트로 포켓몬 스프라이트 최적화
- **수용 기준**:
  - [ ] `bun run test` — 모든 spec 테스트 + 단위 테스트 통과 (Green)
  - [ ] `bun run build` — 빌드 성공, 에러 없음
  - [ ] Desktop/Mobile 반응형 동작 확인
- **커밋**: `feat: 전체 통합 및 스타일 마무리`

---

## 미결정 사항
- 없음
