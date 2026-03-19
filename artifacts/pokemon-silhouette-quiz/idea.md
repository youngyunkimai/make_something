## Overview
"누구의 그 포켓몬?" — 실루엣으로 가려진 포켓몬을 보고 이름을 맞추는 퀴즈 게임. 힌트 시스템과 점수 보너스로 재미를 더하고, 깔끔한 UI로 학교 과제 제출에 적합한 완성도를 목표로 한다.

## 테크 스택
- 프레임워크: Next.js 16 (App Router)
- UI: Tailwind CSS 4, shadcn/ui, Lucide Icons
- 런타임/패키지: Bun
- 테스트: Vitest + Testing Library

## 핵심 기능

### 1. 실루엣 포켓몬 퀴즈
- 설명: PokeAPI에서 랜덤 포켓몬을 가져와 CSS `filter: brightness(0)`로 실루엣 처리. 정답 시 원본 이미지를 부드럽게 공개
- 추천 도구: PokeAPI (무료, 인증 불필요), CSS filter + transition

### 2. 힌트 시스템 (3단계)
- 설명: 1단계 — 타입 공개, 2단계 — 세대/도감번호 범위 공개, 3단계 — 실루엣 일부 공개. 힌트 사용 시 점수 감소
- 추천 도구: PokeAPI species/type 엔드포인트

### 3. 점수 + 연속 정답 보너스
- 설명: 기본 점수 + 연속 정답 보너스 (콤보). 힌트 사용 시 감점. 라운드 종료 후 총점 표시
- 추천 도구: zustand 또는 React useState로 상태 관리

### 4. 결과 요약 화면
- 설명: 퀴즈 종료 후 정답률, 총점, 가장 빠른 정답, 틀린 포켓몬 목록을 보여주는 요약 화면
- 추천 도구: shadcn/ui Card, Progress 컴포넌트

## 추천 무료 도구

### API / 서비스
| 도구 | 용도 | 무료 조건 | 링크 |
|------|------|-----------|------|
| PokeAPI | 포켓몬 데이터 + 스프라이트 이미지 | 완전 무료, 인증 불필요, 무제한 | https://pokeapi.co/ |
| PokeAPI Sprites | 공식 아트워크 + 다양한 스프라이트 | 완전 무료 | https://github.com/PokeAPI/sprites |

### npm 패키지
| 패키지 | 용도 | 비고 |
|--------|------|------|
| zustand | 퀴즈 상태 관리 (점수, 라운드, 힌트) | 경량, 보일러플레이트 최소 |
| motion (framer-motion) | 실루엣 공개 애니메이션, 점수 변화 효과 | React 애니메이션 표준 |
| nanoid | 세션 ID 생성 | 초경량 |

### 디자인 / UI 리소스
| 리소스 | 용도 | 비고 |
|--------|------|------|
| Lucide Icons | UI 아이콘 (힌트, 점수 등) | 프로젝트에 이미 포함 |
| Google Fonts (Press Start 2P) | 레트로 픽셀 폰트로 포켓몬 분위기 연출 | 무료 웹폰트 |
| Pretendard | 한국어 본문 폰트 | 무료, 가독성 우수 |

### 스킬 (선택)
| 도구 | 용도 | 비고 |
|------|------|------|
| kehwar/experiments@pokemon-data-fetcher | PokeAPI 데이터 fetch 헬퍼 | 23 installs, 설치 선택 |
