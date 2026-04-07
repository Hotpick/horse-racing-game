# ARCHITECTURE.md — Interactive Horse Racing Game

> Status: 🟡 In Progress
> Last updated: 2026-04-07
> Stack locked: ✅

---

## 1. Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Vue 3 | `<script setup>` Composition API only, no Options API |
| Language | TypeScript | Strict mode, all components and stores fully typed |
| State Management | Pinia | One store per domain (race, player, etc.) |
| UI Library | shadcn-vue | Component primitives, no override of design tokens |
| Styling | Tailwind CSS | Via shadcn-vue setup; utility-first, mobile-first (`md:` breakpoint = desktop layout) |
| Build Tool | Vite | Fast HMR, ESM-native |
| Linting | ESLint | `@vue/eslint-config-typescript` + recommended rules |
| Formatting | Prettier | Integrated with ESLint via `eslint-config-prettier` |
| Unit Testing | Vitest | Co-located `*.spec.ts` files |
| E2E Testing | Playwright | Tests in `e2e/` directory |
| Animation | CSS / TBD | Native CSS transitions first; revisit if race animation needs more |

---

## 2. Project Structure

```
horse-racing-game/
├── e2e/                        # Playwright e2e tests
├── src/
│   ├── assets/                 # Static assets (images, fonts)
│   ├── components/
│   │   ├── race/               # Race track, horse, countdown, results
│   │   ├── betting/            # Bet form, odds display, history
│   │   └── ui/                 # Shared UI primitives (re-exports from shadcn-vue)
│   ├── composables/            # Reusable Composition API logic (useRace, …)
│   ├── stores/                 # Pinia stores
│   ├── types/                  # Global TypeScript interfaces & enums
│   ├── utils/                  # Pure functions (math, formatting, RNG)
│   ├── App.vue
│   └── main.ts
├── .eslintrc.cjs
├── .prettierrc
├── vite.config.ts
├── tsconfig.json
├── playwright.config.ts
└── vitest.config.ts
```

---

## 3. State Management

### 3.1 Race Store
<!-- Current race, horses, schedule, positions, results, status -->

### 3.2 Player Store
<!-- Out of scope for v1 — no betting system -->

---

## 4. Core Game Logic

### 4.1 Race Engine

- Lives in `src/utils/raceEngine.ts` — pure functions, zero Vue dependency
- Horse positions updated on a **fixed 100ms interval** (`setInterval`) → easy to unit test
- Each tick calls: `position += (condition / 100) * baseSpeed * (0.7 + Math.random() * 0.6)`
- `baseSpeed = trackWidth / ticksPerRound` — recalculated at round start
- Round is finished when the first horse reaches `position >= trackWidth`
- The engine emits state snapshots (array of `{ horseId, position }`) — store consumes them

### 4.2 Animation Layer

- Lives in `src/composables/useRaceAnimation.ts`
- Runs on **`requestAnimationFrame`** — interpolates horse positions between engine ticks for smooth 60fps rendering
- Decoupled from engine: animation reads last known positions and lerps to new ones
- Pause: cancels rAF loop + clears setInterval; resume: restarts both

### 4.3 Betting Logic

_Out of scope for v1._

---

## 5. Component Tree

```
App
└── GameView
        ├── AppHeader          (title, Generate + Start/Pause buttons)
        ├── [desktop: md+]
        │   ├── HorseListPanel
        │   ├── RaceTrack
        │   ├── ProgramPanel
        │   └── ResultsPanel
        └── [mobile: <md]
            ├── MobileTabBar   (Horses | Track | Program | Results)
            └── MobileTabContent
                ├── HorseListPanel   (tab: horses)
                ├── RaceTrack        (tab: track)
                ├── ProgramPanel     (tab: program)
                └── ResultsPanel     (tab: results)
```

Shared components (used in both layouts):
- `HorseListPanel` — scrollable horse table
- `RaceTrack` — animated 10-lane track (scales to container width)
- `ProgramPanel` — 6-round schedule table
- `ResultsPanel` — completed results, updates live

---

## 6. Data Models

<!-- Full interfaces defined in src/types/ — see TASK-007 and TASK-008 -->

```ts
// Horse
interface Horse {
  id: string
  name: string
  condition: number  // 1–100
  color: string      // hex
}

// HorsePosition
interface HorsePosition {
  horseId: string
  position: number   // 0–100 (% of track width)
}

// Round
interface Round {
  id: string
  number: number
  distance: number   // metres
  horseIds: string[]
}

// RaceSchedule
interface RaceSchedule {
  rounds: Round[]
}

// RoundResult
interface RoundResult {
  roundNumber: number
  positions: HorsePosition[]  // ordered by finish
}

// RaceStatus enum
enum RaceStatus { Idle, Generating, Running, Paused, Finished }
```

---

## 7. Key Technical Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Options API vs Composition API | Composition API (`<script setup>`) | Better TypeScript inference, reusable logic via composables, team preference |
| Vuex vs Pinia | Pinia | Vue 3 native, simpler API, full TS support out of the box |
| CSS framework | Tailwind via shadcn-vue | Utility-first, responsive design built-in, shadcn provides accessible components |
| Test runner | Vitest | Same config as Vite, fast, compatible with Vue Test Utils |
| E2E | Playwright | More reliable than Cypress for async-heavy games, multi-browser |
| Animation strategy | rAF + fixed interval | Engine ticks every 100ms (testable); rAF interpolates for smooth 60fps render |

---

## 8. AI Traceability

Every AI-generated source file must carry a header and inline comments that make the AI's role and reasoning explicit.

**File header** (top of every `.ts` / `.vue`):
```ts
// @ai-generated
// Implements: TASK-XXX — [task title]
// Spec ref:   SPEC.md §[section]
```

**Algorithm comments** — reference the spec formula or decision directly:
```ts
// Race engine tick — SPEC.md §2.7
// step = (condition / 100) * baseSpeed * (0.7 + rand * 0.6)
```

**Decision comments** — explain non-obvious choices:
```ts
// setInterval over rAF — deterministic ticks are easier to test with vi.useFakeTimers()
// See ARCHITECTURE.md §4.1
```

**Commit footer**:
```
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

---

## 9. Code Style Rules

- All components use `<script setup lang="ts">`
- Props defined via `defineProps<{...}>()`, emits via `defineEmits<{...}>()`
- No `any` type — use `unknown` + type guards if needed
- Stores export typed `useXxxStore()` composables only
- All utils are pure functions with unit tests
- Mobile-first responsive: design for 375px, scale up

---

## 10. Open Technical Questions

- [ ] Persist horse list / results between sessions? (localStorage vs none — leaning none for v1)
