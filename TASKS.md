# TASKS.md — Horse Racing Game

> Generated: 2026-04-07
> Total: 40 tasks | Completed: 0

---

## Phase 0: Project Setup & Config

---

### TASK-001: Initialize Vite + Vue 3 + TypeScript project

**Type:** config
**File:** `package.json`, `vite.config.ts`, `tsconfig.json`
**Depends on:** none
**Status:** `[ ]` pending

**What to build:**
Scaffold the project with `npm create vue@latest` selecting Vue 3, TypeScript, Vue Router, Pinia, Vitest, ESLint + Prettier. Verify `npm run dev` starts without errors.

**Acceptance criteria:**
- [ ] `npm run dev` starts the dev server on localhost
- [ ] `src/App.vue` uses `<script setup lang="ts">`
- [ ] `tsconfig.json` has `"strict": true`

---

### TASK-002: Configure ESLint + Prettier

**Type:** config
**File:** `.eslintrc.cjs`, `.prettierrc`
**Depends on:** TASK-001
**Status:** `[ ]` pending

**What to build:**
Configure ESLint with `@vue/eslint-config-typescript` and `eslint-config-prettier`. Add `.prettierrc` with project defaults (single quotes, no semicolons, 2-space indent). Add `lint` script to `package.json`.

**Acceptance criteria:**
- [ ] `npm run lint` exits with code 0 on a clean project
- [ ] Prettier and ESLint do not conflict (no double-formatting errors)
- [ ] `package.json` has `"lint": "eslint . --ext .vue,.ts,.tsx --fix"`

---

### TASK-003: Install and configure Tailwind CSS + shadcn-vue

**Type:** config
**File:** `tailwind.config.ts`, `src/assets/index.css`, `components.json`
**Depends on:** TASK-001
**Status:** `[ ]` pending

**What to build:**
Install Tailwind CSS via the shadcn-vue setup guide. Initialize shadcn-vue (`npx shadcn-vue@latest init`). Add custom color tokens to `tailwind.config.ts`: `panel-program`, `panel-results`, `panel-horses`, `track-lane`, `track-bg`. Verify a shadcn-vue `Button` renders correctly in `App.vue`.

**Acceptance criteria:**
- [ ] Tailwind utility classes apply correctly in components
- [ ] `npx shadcn-vue@latest add button` installs without errors
- [ ] Custom color tokens are accessible as Tailwind classes (e.g. `bg-track-lane`)

---

### TASK-004: Configure Vitest

**Type:** config
**File:** `vitest.config.ts`
**Depends on:** TASK-001
**Status:** `[ ]` pending

**What to build:**
Configure Vitest with `@vue/test-utils` and `jsdom` environment. Add `test:unit` script. Ensure a sample test file runs with `npm run test:unit`.

**Acceptance criteria:**
- [ ] `npm run test:unit` runs and passes a sample test
- [ ] `@vue/test-utils` `mount()` works in test files
- [ ] Coverage report generates with `npm run test:unit -- --coverage`

---

### TASK-005: Configure Playwright

**Type:** config
**File:** `playwright.config.ts`
**Depends on:** TASK-001
**Status:** `[ ]` pending

**What to build:**
Install and configure Playwright for Chromium. Add `test:e2e` script. Create an `e2e/` directory with a smoke test that navigates to `localhost` and checks the page title.

**Acceptance criteria:**
- [ ] `npm run test:e2e` runs and passes the smoke test
- [ ] Tests run against `http://localhost:5173`
- [ ] `e2e/` directory exists with at least one `.spec.ts` file

---

### TASK-006: Add npm scripts to package.json

**Type:** config
**File:** `package.json`
**Depends on:** TASK-002, TASK-004, TASK-005
**Status:** `[ ]` pending

**What to build:**
Ensure all required scripts exist: `dev`, `build`, `preview`, `type-check`, `lint`, `test:unit`, `test:e2e`. `type-check` must use `vue-tsc --noEmit`.

**Acceptance criteria:**
- [ ] `npm run type-check` exits 0 on a clean project
- [ ] All 7 scripts are present in `package.json`

---

## Phase 1: Types & Data Models

---

### TASK-007: Define core game TypeScript interfaces

**Type:** type
**File:** `src/types/horse.ts`, `src/types/race.ts`
**Depends on:** TASK-001
**Status:** `[ ]` pending

**What to build:**
Define and export: `Horse` (id, name, condition, color), `HorsePosition` (horseId, position 0–100), `Round` (id, number, distance, horseIds), `RaceSchedule` (rounds array). No `any` types. Use `Readonly` where values should not mutate.

**Acceptance criteria:**
- [ ] All interfaces exported as named exports
- [ ] `Horse.condition` typed as `number` with JSDoc range comment `// 1-100`
- [ ] `HorsePosition.position` typed as `number` with JSDoc range comment `// 0-100`
- [ ] `npm run type-check` passes

---

### TASK-008: Define RaceStatus enum and game state types

**Type:** type
**File:** `src/types/gameState.ts`
**Depends on:** TASK-007
**Status:** `[ ]` pending

**What to build:**
Define `RaceStatus` enum (`Idle | Generating | Running | Paused | Finished`), `GameState` interface (status, currentRoundIndex, horses, schedule, results), and `RoundResult` interface (roundNumber, positions ordered by finish).

**Acceptance criteria:**
- [ ] `RaceStatus` is an `enum`, not a string union
- [ ] `GameState` covers all fields needed by the store (TASK-019)
- [ ] `npm run type-check` passes

---

## Phase 2: Core Game Logic

---

### TASK-009: Implement horse name generator utility

**Type:** util
**File:** `src/utils/horseNames.ts`
**Depends on:** none
**Status:** `[ ]` pending

**What to build:**
Export `ADJECTIVES` and `NOUNS` word lists (20 each, as defined in SPEC §2.8). Export pure function `generateHorseNames(count: number): string[]` that shuffles both lists and pairs them index-by-index to produce `count` unique `"Adjective Noun"` names.

**Acceptance criteria:**
- [ ] Returns exactly `count` unique strings
- [ ] Each name matches `[Adjective] [Noun]` format
- [ ] Calling twice with the same count produces different orderings (shuffle works)
- [ ] No name appears twice in a single call

---

### TASK-010: Unit test horse name generator

**Type:** test:unit
**File:** `src/utils/horseNames.spec.ts`
**Depends on:** TASK-009
**Status:** `[ ]` pending

**What to build:**
Vitest suite covering: correct count returned, all names unique, format matches `/^\w+ \w+$/`, both word lists are exported and each has 20 items.

**Acceptance criteria:**
- [ ] `generateHorseNames(20)` returns array of length 20
- [ ] All 20 names are unique strings
- [ ] Word list exports (`ADJECTIVES`, `NOUNS`) each have exactly 20 items
- [ ] All tests pass with `npm run test:unit`

---

### TASK-011: Implement horse color palette utility

**Type:** util
**File:** `src/utils/horseColors.ts`
**Depends on:** none
**Status:** `[ ]` pending

**What to build:**
Export `HORSE_COLORS` — an array of exactly 20 visually distinct hex color strings. Export `assignColors(count: number): string[]` that returns `count` colors from the palette in shuffled order (no repeats within a call).

**Acceptance criteria:**
- [ ] `HORSE_COLORS` has exactly 20 entries
- [ ] All 20 colors are visually distinguishable (no two near-identical values)
- [ ] `assignColors(20)` returns all 20 unique colors
- [ ] `assignColors(10)` returns 10 unique colors from the palette

---

### TASK-012: Unit test horse color palette

**Type:** test:unit
**File:** `src/utils/horseColors.spec.ts`
**Depends on:** TASK-011
**Status:** `[ ]` pending

**What to build:**
Vitest suite: palette length, valid hex format, no duplicates in palette, `assignColors` returns correct count with no duplicates.

**Acceptance criteria:**
- [ ] `HORSE_COLORS.length === 20`
- [ ] Every color matches `/^#[0-9a-fA-F]{6}$/`
- [ ] `assignColors(20)` returns 20 unique values
- [ ] All tests pass

---

### TASK-013: Implement horse pool generator

**Type:** util
**File:** `src/utils/generateHorsePool.ts`
**Depends on:** TASK-007, TASK-009, TASK-011
**Status:** `[ ]` pending

**What to build:**
Export pure function `generateHorsePool(): Horse[]` that creates exactly 20 horses, each with a unique `id` (uuid or index-based), name from `generateHorseNames`, condition randomly sampled from 1–100, and color from `assignColors`. Returns a frozen array.

**Acceptance criteria:**
- [ ] Returns exactly 20 `Horse` objects
- [ ] All `id` values are unique
- [ ] All `name` values are unique
- [ ] All `color` values are unique
- [ ] Each `condition` is an integer between 1 and 100 inclusive

---

### TASK-014: Unit test horse pool generator

**Type:** test:unit
**File:** `src/utils/generateHorsePool.spec.ts`
**Depends on:** TASK-013
**Status:** `[ ]` pending

**What to build:**
Vitest suite: pool length, uniqueness of id/name/color, condition range validation.

**Acceptance criteria:**
- [ ] Pool length is 20
- [ ] All ids unique, all names unique, all colors unique
- [ ] All condition values satisfy `1 <= condition <= 100`
- [ ] All tests pass

---

### TASK-015: Implement race schedule generator

**Type:** util
**File:** `src/utils/generateSchedule.ts`
**Depends on:** TASK-007
**Status:** `[ ]` pending

**What to build:**
Export `ROUND_DISTANCES: number[]` = `[1200, 1400, 1600, 1800, 2000, 2200]` and `TICKS_PER_ROUND: number[]` = `[150, 175, 200, 225, 250, 275]`. Export pure function `generateSchedule(horses: Horse[]): RaceSchedule` that creates 6 rounds, each with 10 randomly selected horse ids from the pool (without replacement per round, but horses can appear in multiple rounds).

**Acceptance criteria:**
- [ ] Returns a `RaceSchedule` with exactly 6 rounds
- [ ] Each round has exactly 10 unique horse ids
- [ ] Each round has the correct distance from `ROUND_DISTANCES`
- [ ] Horse ids in each round exist in the provided horses array

---

### TASK-016: Unit test race schedule generator

**Type:** test:unit
**File:** `src/utils/generateSchedule.spec.ts`
**Depends on:** TASK-015
**Status:** `[ ]` pending

**What to build:**
Vitest suite: correct number of rounds, correct distances, 10 horses per round, no duplicate ids within a round, all ids valid.

**Acceptance criteria:**
- [ ] 6 rounds generated
- [ ] Round distances match `[1200, 1400, 1600, 1800, 2000, 2200]`
- [ ] Each round has exactly 10 unique horse ids
- [ ] All tests pass

---

### TASK-017: Implement race engine

**Type:** util
**File:** `src/utils/raceEngine.ts`
**Depends on:** TASK-007, TASK-008
**Status:** `[ ]` pending

**What to build:**
Export pure function `computeTick(positions: HorsePosition[], horses: Horse[], baseSpeed: number): HorsePosition[]` that advances each horse by `(condition/100) * baseSpeed * (0.7 + Math.random() * 0.6)`. Export `computeBaseSpeed(trackWidth: number, ticks: number): number` = `trackWidth / ticks`. Export `getRoundWinner(positions: HorsePosition[]): string` (returns horseId of first to reach position >= trackWidth). No side effects, no Vue imports.

**Acceptance criteria:**
- [ ] `computeTick` returns a new array (does not mutate input)
- [ ] Each horse's new position is strictly greater than its previous
- [ ] `computeBaseSpeed(1000, 150)` returns approximately `6.67`
- [ ] `getRoundWinner` returns the id of the horse with the highest position
- [ ] Zero Vue dependencies in this file

---

### TASK-018: Unit test race engine

**Type:** test:unit
**File:** `src/utils/raceEngine.spec.ts`
**Depends on:** TASK-017
**Status:** `[ ]` pending

**What to build:**
Vitest suite: immutability of `computeTick`, position increases, `computeBaseSpeed` calculation, `getRoundWinner` picks the correct horse.

**Acceptance criteria:**
- [ ] Input array is not mutated by `computeTick`
- [ ] All positions increase after a tick
- [ ] `getRoundWinner` correctly identifies the leading horse
- [ ] All tests pass

---

## Phase 3: State Management

---

### TASK-019: Implement raceStore

**Type:** store
**File:** `src/stores/raceStore.ts`
**Depends on:** TASK-007, TASK-008, TASK-013, TASK-015, TASK-017
**Status:** `[ ]` pending

**What to build:**
Pinia setup store (`defineStore('race', () => {...})`). State: `status: Ref<RaceStatus>`, `horses: Ref<Horse[]>`, `schedule: Ref<RaceSchedule | null>`, `currentRoundIndex: Ref<number>`, `positions: Ref<HorsePosition[]>`, `results: Ref<RoundResult[]>`. Actions: `generateProgram()` (calls pool + schedule generators), `startRace()`, `pauseRace()`, `resumeRace()`, `advanceTick()` (calls `computeTick`, checks for winner, advances round or finishes race), `resetRace()`.

**Acceptance criteria:**
- [ ] `generateProgram()` sets status to `Idle` and populates `horses` and `schedule`
- [ ] `startRace()` sets status to `Running` and resets positions to 0
- [ ] `pauseRace()` sets status to `Paused` without clearing positions
- [ ] `advanceTick()` updates positions and appends to `results` when a round ends
- [ ] Store exported as `useRaceStore` only

---

### TASK-020: Unit test raceStore

**Type:** test:unit
**File:** `src/stores/raceStore.spec.ts`
**Depends on:** TASK-019
**Status:** `[ ]` pending

**What to build:**
Vitest suite using `setActivePinia(createPinia())`. Test each action: `generateProgram` populates state, `startRace` changes status, `pauseRace` freezes state, `advanceTick` progresses positions, round completion appends result.

**Acceptance criteria:**
- [ ] `generateProgram()` → `horses.length === 20` and `schedule.rounds.length === 6`
- [ ] `startRace()` → `status === RaceStatus.Running`
- [ ] `pauseRace()` → `status === RaceStatus.Paused`, positions unchanged
- [ ] After enough `advanceTick()` calls, `results` contains at least one entry
- [ ] All tests pass

---

## Phase 4: Composables

---

### TASK-021: Implement useRaceAnimation composable

**Type:** composable
**File:** `src/composables/useRaceAnimation.ts`
**Depends on:** TASK-019
**Status:** `[ ]` pending

**What to build:**
Composable that drives the race loop: starts `setInterval` at 100ms calling `raceStore.advanceTick()`, and a `requestAnimationFrame` loop that reads `raceStore.positions` and writes interpolated values to a `Ref<HorsePosition[]>` (lerp between last and current tick). Exposes `{ animatedPositions, start, pause, resume }`. Cleans up interval and rAF on `onUnmounted`.

**Acceptance criteria:**
- [ ] `start()` begins both the interval and rAF loop
- [ ] `pause()` cancels both without resetting positions
- [ ] `resume()` restarts both from current state
- [ ] `animatedPositions` updates every rAF frame
- [ ] No memory leaks — both interval and rAF are cancelled on unmount

---

### TASK-022: Unit test useRaceAnimation

**Type:** test:unit
**File:** `src/composables/useRaceAnimation.spec.ts`
**Depends on:** TASK-021
**Status:** `[ ]` pending

**What to build:**
Vitest suite using `vi.useFakeTimers()` and mocked `requestAnimationFrame`. Test: `start()` calls `advanceTick` after 100ms, `pause()` stops the interval, `resume()` restarts it, cleanup on unmount.

**Acceptance criteria:**
- [ ] After `start()` + `vi.advanceTimersByTime(100)`, `advanceTick` has been called once
- [ ] After `pause()`, advancing time does not call `advanceTick`
- [ ] Interval and rAF handles are cleared on `onUnmounted`
- [ ] All tests pass

---

## Phase 5: Components

---

### TASK-023: Build AppHeader component

**Type:** component
**File:** `src/components/AppHeader.vue`
**Depends on:** TASK-019
**Status:** `[ ]` pending

**What to build:**
Sticky header (`h-14`, coral/salmon background as per design). Left: "Horse Racing" title. Right: "Generate Program" button (disabled during Running/Paused) and "Start / Pause" button (disabled before program generated). Buttons read `raceStore.status` to compute disabled state and label ("Start" vs "Pause"). Emit no events — call store actions directly.

**Acceptance criteria:**
- [ ] "Generate Program" is disabled when `status === Running || Paused`
- [ ] Start button shows "Start" when `Idle`, "Pause" when `Running`, "Resume" when `Paused`
- [ ] Start button is disabled when `status === Idle && !schedule`
- [ ] Uses shadcn-vue `Button` component

---

### TASK-024: Unit test AppHeader

**Type:** test:unit
**File:** `src/components/AppHeader.spec.ts`
**Depends on:** TASK-023
**Status:** `[ ]` pending

**What to build:**
Vue Test Utils suite: renders title, button states match RaceStatus, correct labels shown for each status.

**Acceptance criteria:**
- [ ] Title "Horse Racing" is rendered
- [ ] "Generate Program" is disabled when status is Running
- [ ] Start button label cycles correctly across Idle → Running → Paused
- [ ] All tests pass

---

### TASK-025: Build HorseListPanel component

**Type:** component
**File:** `src/components/race/HorseListPanel.vue`
**Depends on:** TASK-007, TASK-019
**Status:** `[ ]` pending

**What to build:**
Scrollable panel showing all 20 horses in a shadcn-vue `Table`. Columns: Name, Condition (number), Color (filled circle swatch). Panel header "Horse List (1–20)" with yellow background. Empty state when `horses` is empty (before generate). Reads from `raceStore.horses`.

**Acceptance criteria:**
- [ ] Renders 20 rows when store has 20 horses
- [ ] Each row shows name, condition number, and colored swatch
- [ ] Color swatch `background-color` matches `horse.color`
- [ ] Panel is scrollable (`overflow-y-auto`)
- [ ] Empty state shown when `horses` array is empty

---

### TASK-026: Unit test HorseListPanel

**Type:** test:unit
**File:** `src/components/race/HorseListPanel.spec.ts`
**Depends on:** TASK-025
**Status:** `[ ]` pending

**What to build:**
Suite: renders correct row count, row content matches horse data, empty state visible when no horses.

**Acceptance criteria:**
- [ ] 20 rows rendered for 20 horses
- [ ] First horse's name appears in the first row
- [ ] Empty state element is present when horses array is empty
- [ ] All tests pass

---

### TASK-027: Build RaceTrack component

**Type:** component
**File:** `src/components/race/RaceTrack.vue`
**Depends on:** TASK-007, TASK-021
**Status:** `[ ]` pending

**What to build:**
Animated race track. Receives `horses: Horse[]` (current round participants) and `animatedPositions: HorsePosition[]` as props. Renders 10 lanes: left strip with lane number (green background), track area with horse silhouette positioned via `transform: translateX(position%)`, red finish line on right edge. Bottom label shows current round (e.g. "1st Lap 1200m") and "FINISH". Scales to container width (no fixed pixel widths).

**Acceptance criteria:**
- [ ] Renders exactly 10 lanes when given 10 horses
- [ ] Each horse silhouette's `transform` reflects its position value
- [ ] Finish line is visible on the right edge
- [ ] Round label updates when `currentRoundIndex` changes in store
- [ ] Track fills available container width (uses `w-full`)

---

### TASK-028: Unit test RaceTrack

**Type:** test:unit
**File:** `src/components/race/RaceTrack.spec.ts`
**Depends on:** TASK-027
**Status:** `[ ]` pending

**What to build:**
Suite: correct lane count, horse transform reflects position, round label renders correctly.

**Acceptance criteria:**
- [ ] 10 lane elements rendered
- [ ] A horse at position 50 has `translateX(50%)`in its style
- [ ] Round label contains the correct distance string
- [ ] All tests pass

---

### TASK-029: Build ProgramPanel component

**Type:** component
**File:** `src/components/race/ProgramPanel.vue`
**Depends on:** TASK-007, TASK-019
**Status:** `[ ]` pending

**What to build:**
Scrollable panel with blue header "Program". Shows all 6 rounds grouped by lap, each with a sub-header (e.g. "1ST Lap – 1200m") and a table of Position + Name. Populated from `raceStore.schedule`. Empty state before generate. Positions in program are pre-race lineup order (1–10 by schedule index).

**Acceptance criteria:**
- [ ] 6 lap sections rendered when schedule exists
- [ ] Each section header shows correct distance
- [ ] 10 rows per section
- [ ] Empty state before program is generated
- [ ] Panel header is blue (`panel-program` color)

---

### TASK-030: Unit test ProgramPanel

**Type:** test:unit
**File:** `src/components/race/ProgramPanel.spec.ts`
**Depends on:** TASK-029
**Status:** `[ ]` pending

**What to build:**
Suite: section count, header labels, row count per section, empty state.

**Acceptance criteria:**
- [ ] 6 sections rendered for a full schedule
- [ ] First section header contains "1200m"
- [ ] Each section has 10 rows
- [ ] All tests pass

---

### TASK-031: Build ResultsPanel component

**Type:** component
**File:** `src/components/race/ResultsPanel.vue`
**Depends on:** TASK-007, TASK-008, TASK-019
**Status:** `[ ]` pending

**What to build:**
Scrollable panel with green header "Results". Same structure as ProgramPanel but populated from `raceStore.results` — only shows rounds that have been completed. Each section shows horses ranked by finish position. Empty state before any round completes.

**Acceptance criteria:**
- [ ] Shows 0 sections before race starts
- [ ] After round 1 completes, shows 1 section with correct results
- [ ] Sections appear in order as rounds complete
- [ ] Panel header is green (`panel-results` color)

---

### TASK-032: Unit test ResultsPanel

**Type:** test:unit
**File:** `src/components/race/ResultsPanel.spec.ts`
**Depends on:** TASK-031
**Status:** `[ ]` pending

**What to build:**
Suite: empty state, section count matches completed rounds, positions ranked correctly.

**Acceptance criteria:**
- [ ] Empty state visible when `results` is empty
- [ ] One section visible when `results` has one entry
- [ ] Horses listed in finish order (position 1 first)
- [ ] All tests pass

---

### TASK-033: Build MobileTabBar component

**Type:** component
**File:** `src/components/MobileTabBar.vue`
**Depends on:** TASK-025, TASK-027, TASK-029, TASK-031
**Status:** `[ ]` pending

**What to build:**
Mobile-only tab navigation using shadcn-vue `Tabs`. Four equal-width tabs: Horses | Track | Program | Results. Active tab auto-switches to Track when `raceStore.status` changes to `Running`. Results tab shows a red badge dot when new results arrive while not on the Results tab. Renders the correct panel component for each active tab.

**Acceptance criteria:**
- [ ] All 4 tabs render their respective panel content
- [ ] Active tab switches to Track when race starts
- [ ] Badge dot appears on Results tab when a new result arrives on a different tab
- [ ] Badge clears when Results tab is selected
- [ ] Only visible on `< md` screens (`block md:hidden`)

---

### TASK-034: Unit test MobileTabBar

**Type:** test:unit
**File:** `src/components/MobileTabBar.spec.ts`
**Depends on:** TASK-033
**Status:** `[ ]` pending

**What to build:**
Suite: 4 tabs rendered, correct panel shown for active tab, auto-switch on race start, badge logic.

**Acceptance criteria:**
- [ ] 4 tab triggers rendered
- [ ] Clicking "Horses" tab shows HorseListPanel
- [ ] Setting store status to Running switches active tab to Track
- [ ] Badge appears on Results tab after result added while on another tab
- [ ] All tests pass

---

## Phase 6: Views

---

### TASK-035: Build GameView

**Type:** view
**File:** `src/views/GameView.vue`
**Depends on:** TASK-023, TASK-025, TASK-027, TASK-029, TASK-031, TASK-033, TASK-021
**Status:** `[ ]` pending

**What to build:**
Root view. Renders `AppHeader` (sticky top). Desktop layout (`hidden md:grid`, 4-column grid): `HorseListPanel` | `RaceTrack` | `ProgramPanel` | `ResultsPanel`. Mobile layout (`block md:hidden`): `MobileTabBar`. Instantiates `useRaceAnimation` here and passes `animatedPositions` to `RaceTrack`. Wires store status to composable `start/pause/resume`.

**Acceptance criteria:**
- [ ] Desktop grid visible at `md` breakpoint and above
- [ ] Mobile tab layout visible below `md`
- [ ] `useRaceAnimation.start()` called when store status becomes Running
- [ ] `useRaceAnimation.pause()` called when store status becomes Paused
- [ ] Full page height with no overflow (`h-screen overflow-hidden`)

---

### TASK-036: Unit test GameView

**Type:** test:unit
**File:** `src/views/GameView.spec.ts`
**Depends on:** TASK-035
**Status:** `[ ]` pending

**What to build:**
Suite: AppHeader rendered, desktop panels present in DOM, MobileTabBar present in DOM, animation composable wired to store status changes.

**Acceptance criteria:**
- [ ] `AppHeader` component is rendered
- [ ] `HorseListPanel` is in the DOM
- [ ] `MobileTabBar` is in the DOM
- [ ] All tests pass

---

## Phase 7: E2E Tests

---

### TASK-037: E2E — generate program flow

**Type:** test:e2e
**File:** `e2e/generateProgram.spec.ts`
**Depends on:** TASK-036
**Status:** `[ ]` pending

**What to build:**
Playwright test: navigate to `/`, click "Generate Program", assert horse list shows 20 rows, program panel shows 6 sections, Start button is enabled.

**Acceptance criteria:**
- [ ] Horse list table has 20 rows after generate
- [ ] Program panel has 6 lap sections
- [ ] Start button is enabled after generate
- [ ] Test passes in Chromium

---

### TASK-038: E2E — full race execution

**Type:** test:e2e
**File:** `e2e/raceExecution.spec.ts`
**Depends on:** TASK-037
**Status:** `[ ]` pending

**What to build:**
Playwright test: generate program, click Start, wait for all 6 rounds to complete, assert Results panel has 6 sections each with 10 rows.

**Acceptance criteria:**
- [ ] After race completes, Results panel shows 6 sections
- [ ] Each section has 10 horse results
- [ ] Race finishes within 5 minutes (timeout guard)
- [ ] Test passes in Chromium

---

### TASK-039: E2E — pause and resume mid-race

**Type:** test:e2e
**File:** `e2e/pauseResume.spec.ts`
**Depends on:** TASK-038
**Status:** `[ ]` pending

**What to build:**
Playwright test: generate + start, click Pause after 1 second, assert horse positions do not change for 2 seconds, click Resume, assert positions resume changing.

**Acceptance criteria:**
- [ ] Horse silhouette positions are static while paused
- [ ] Positions update again after resume
- [ ] Button label changes: Start → Pause → Resume → Pause
- [ ] Test passes in Chromium

---

### TASK-040: E2E — mobile tab navigation

**Type:** test:e2e
**File:** `e2e/mobileLayout.spec.ts`
**Depends on:** TASK-037
**Status:** `[ ]` pending

**What to build:**
Playwright test at 375px viewport: assert desktop panels are hidden, tab bar is visible, clicking each tab shows correct content, starting race auto-switches to Track tab.

**Acceptance criteria:**
- [ ] Desktop 4-panel grid is not visible at 375px
- [ ] Tab bar is visible with 4 tabs
- [ ] Clicking "Horses" tab shows horse list content
- [ ] Starting race switches active tab to Track
- [ ] Test passes in Chromium at 375×812 viewport
