---
name: task-writer
description: "Break down SPEC.md sections into atomic, AI-executable development tasks and write them to TASKS.md. Use this skill whenever creating a task list, sprint backlog, or implementation plan from a specification. Triggers on: 'create tasks', 'break down the spec', 'write TASKS.md', 'create task list', 'plan the implementation', 'what should I build first', or any request to convert requirements into ordered, actionable development steps. Always use this skill to generate TASKS.md rather than doing it manually."
---

# Task Writer

Converts SPEC.md sections into granular, AI-executable tasks for TASKS.md. The goal is tasks small enough that an AI coding agent can implement each one in a single focused session — one file, one concern, one reviewable diff.

## Process

1. Read `SPEC.md` and `ARCHITECTURE.md` from the project folder (always read both — architecture decisions affect how tasks are structured and ordered)
2. For the requested section(s), enumerate all deliverables: types, utils, stores, composables, components, views, tests
3. Order by dependency chain: types → utils → engine logic → stores → composables → components → views → e2e tests
4. Write to `TASKS.md` using the format below

---

## Task Format

```markdown
### TASK-XXX: [Short imperative title]

**Type:** component | composable | store | util | type | view | test:unit | test:e2e | config
**File:** `src/path/to/file.ts`
**Depends on:** TASK-001, TASK-002  (or "none")
**Status:** `[ ]` pending

**What to build:**
1–3 sentences. What this file does, what it accepts, what it returns or renders.

**Acceptance criteria:**
- [ ] specific, verifiable outcome
- [ ] another criterion
- [ ] (unit test) specific assertion that must pass
```

---

## TASKS.md Structure

```markdown
# TASKS.md — [Project Name]

> Generated: [date]
> Total: N tasks | Completed: 0

---

## Phase 0: Project Setup & Config
## Phase 1: Types & Data Models
## Phase 2: Core Game Logic (pure utils / engine)
## Phase 3: State Management (Pinia stores)
## Phase 4: Composables
## Phase 5: Components
## Phase 6: Views & Routing
## Phase 7: E2E Tests
```

---

## Granularity Rules

**Split into separate tasks when:**
- The file would be > ~100 lines
- The unit serves two distinct concerns
- It could reasonably be reviewed as a standalone PR

**Keep as one task when:**
- It's a simple interface or enum (< 20 lines)
- It's a small pure utility function (< 30 lines)
- The component and its test are trivially small

**Every implementation task gets a paired test task** immediately after it (TASK-005 implements, TASK-006 tests). Don't bundle implementation + tests in the same task — they should be reviewable separately.

---

## Ordering Principle

Dependencies always come before dependents. If Task B uses something from Task A, Task A comes first. When in doubt, ask: "could I implement this task right now with only the completed tasks above it?" If yes, the order is correct.

---

## Example Output (excerpt)

```markdown
### TASK-001: Define Horse and Race TypeScript interfaces

**Type:** type
**File:** `src/types/horse.ts`, `src/types/race.ts`
**Depends on:** none
**Status:** `[ ]` pending

**What to build:**
Define the core data interfaces: `Horse` (id, name, condition, color), `Race` (id, round, distance, horses, status), `Bet`, and the `RaceStatus` enum ('idle' | 'running' | 'paused' | 'finished').

**Acceptance criteria:**
- [ ] All interfaces exported as named exports
- [ ] `RaceStatus` is an enum, not a string union
- [ ] No `any` types used anywhere

---

### TASK-002: Implement horse name generator utility

**Type:** util
**File:** `src/utils/horseNames.ts`
**Depends on:** none
**Status:** `[ ]` pending

**What to build:**
Pure function `generateHorseNames(count: number): string[]` that combines shuffled adjective and noun arrays to produce `count` unique names (e.g. "Swift Arrow"). Export the word lists as constants for testability.

**Acceptance criteria:**
- [ ] Returns exactly `count` unique names
- [ ] Names follow `[Adjective] [Noun]` format
- [ ] No name appears twice in a single call

---

### TASK-003: Unit test horse name generator

**Type:** test:unit
**File:** `src/utils/horseNames.spec.ts`
**Depends on:** TASK-002
**Status:** `[ ]` pending

**What to build:**
Vitest test suite covering: returns correct count, all names unique, format is two words, deterministic with a seeded RNG (if applicable).

**Acceptance criteria:**
- [ ] `generateHorseNames(20)` returns 20 unique strings
- [ ] Each name matches `/^[A-Z][a-z]+ [A-Z][a-z]+$/`
- [ ] All tests pass with `vitest run`
```
