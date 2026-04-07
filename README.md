# 🏇 Horse Racing Game

An interactive browser-based horse racing simulation built with Vue 3. Generate a pool of horses, create a 6-round race schedule, and watch the races unfold with real-time animation.

---

## Features

- **20 horses** — each with a unique name, color, and condition score (1–100)
- **6-round schedule** — distances from 1200m to 2200m, 10 random horses per round
- **Animated race track** — horses move in real time, positions driven by condition + randomness
- **Start / Pause** — freeze the race mid-track and resume at any time
- **Live results** — Results panel populates round by round as races finish
- **Responsive** — 4-panel desktop layout; tab-based mobile layout

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run unit tests
npm run test:unit

# Run e2e tests
npm run test:e2e

# Type check
npm run type-check

# Lint
npm run lint
```

---

## How to Play

1. Click **Generate Program** — creates 20 horses and a 6-round schedule
2. Review the horse list and program
3. Click **Start** — races begin, one round at a time
4. Use **Pause** to freeze the race mid-track; click **Start** again to resume
5. Watch Results populate after each round

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Vue 3 + Composition API (`<script setup lang="ts">`) |
| Language | TypeScript (strict mode) |
| State | Pinia (setup store syntax) |
| UI | shadcn-vue + Tailwind CSS |
| Build | Vite |
| Unit tests | Vitest + Vue Test Utils |
| E2E tests | Playwright |
| Linting | ESLint + Prettier |

---

## Project Structure

```
src/
├── components/
│   ├── race/        # RaceTrack, HorseListPanel, ProgramPanel, ResultsPanel
│   └── ui/          # shadcn-vue re-exports
├── composables/     # useRaceAnimation.ts, ...
├── stores/          # raceStore.ts, ...
├── types/           # Horse, Race, RaceStatus interfaces
└── utils/           # raceEngine.ts (pure), horseNames.ts, ...
e2e/                 # Playwright tests
```

---

## Race Engine

Horse positions are updated every **100ms** (fixed interval) using:

```
step = (condition / 100) * baseSpeed * (0.7 + Math.random() * 0.6)
```

- `condition` drives base speed — higher condition = faster on average
- `±30%` random variance per tick allows upsets
- A horse with condition 90 wins ~80% of races vs condition 30
- `requestAnimationFrame` interpolates between ticks for smooth 60fps rendering
- Longer rounds use more ticks → more variance → more drama

| Round | Distance | Ticks |
|-------|----------|-------|
| 1 | 1200 m | 150 |
| 2 | 1400 m | 175 |
| 3 | 1600 m | 200 |
| 4 | 1800 m | 225 |
| 5 | 2000 m | 250 |
| 6 | 2200 m | 275 |

---

## Layout

### Desktop (≥ 768px)
Four panels side by side: Horse List → Race Track → Program → Results

### Mobile (< 768px)
Tab navigation: **Horses** | **Track** | **Program** | **Results**
- Track tab auto-activates when race starts
- Results tab shows a badge dot when new results arrive

---

## AI Development

This project is 100% AI-coded using **Claude Code**. Project context lives in `.claude/`:

```
.claude/
├── CLAUDE.md          # Instructions and code rules for Claude
└── skills/
    ├── vue-component/ # Generates Vue components, stores, composables
    ├── task-writer/   # Breaks SPEC into atomic TASKS.md tasks
    └── frontend-design/ # UI design guidance
```

Full specification: [`SPEC.md`](./SPEC.md)
Architecture decisions: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
Task tracking: [`TASKS.md`](./TASKS.md) *(generated next)*

---

## Out of Scope (v1)

- Betting / wagering
- User accounts or session persistence
- Sound effects
- Multiplayer
- Replay functionality
