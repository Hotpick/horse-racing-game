# SPEC.md — Interactive Horse Racing Game

> Status: ✅ Complete
> Last updated: 2026-04-07

---

## 1. Overview

An interactive browser-based horse racing simulation. The user generates a pool of 20 horses, creates a 6-round race schedule, then watches the races run one round at a time with animated horse movement. Results are displayed sequentially after each round concludes. No betting system in v1 — the focus is on simulation, animation, and clean data display.

---

## 2. Core Features

### 2.1 Horse Pool

- Total pool: always exactly **20 horses**
- Each horse has:
  - `name` — unique name (pre-defined list or randomly generated)
  - `condition` — integer from **1 to 100** (randomly assigned on generation)
  - `color` — unique color per horse (20 distinct colors, one per horse)
- The horse list is displayed in a scrollable table in the left panel
- The pool is fixed for the entire session after generation

### 2.2 Race Schedule (Program)

- Triggered by clicking **"Generate Program"**
- Creates a schedule of **6 rounds**, each with a different distance:

| Round | Distance |
|-------|----------|
| 1 | 1200 m |
| 2 | 1400 m |
| 3 | 1600 m |
| 4 | 1800 m |
| 5 | 2000 m |
| 6 | 2200 m |

- For each round: **10 horses are randomly selected** from the pool of 20
- The full schedule (all 6 rounds with their participants and positions) is shown in the **Program panel** before the race starts

### 2.3 Race Execution

- Triggered by clicking **"Start / Pause"**
- Rounds run **sequentially**, one at a time
- The user can **pause and resume** mid-race — pause **freezes animation mid-track** (horses stop in place)
- Horse movement is **animated** on the track during each round
- Each horse's position is updated **every animation tick** using a per-tick speed formula (see §2.7)
- After a round finishes, its results appear in the **Results panel** before the next round begins

### 2.4 Animated Race Track (Center Panel)

- Displays **10 lanes**, one per horse in the current round
- Lane number shown on the left (green strip)
- Each horse rendered as a **silhouette/icon** that moves left → right
- A vertical **red FINISH line** on the right edge
- Current round label shown below the track (e.g. "1st Lap 1200m")
- "FINISH" label at the bottom right

### 2.5 Program Panel (Right — Left Column)

- Blue header: **"Program"**
- Shows all 6 rounds grouped by lap
- Each lap section has a colored sub-header (e.g. "1ST Lap – 1200m")
- Columns: `Position`, `Name`
- Pre-populated after Generate, shows expected/scheduled lineup

### 2.6 Results Panel (Right — Right Column)

- Green header: **"Results"**
- Same structure as Program panel
- Populated **after each round concludes**
- Results appear round by round as races finish
- Scrollable to see all completed rounds

---

## 3. Game Flow

```
App Load
  └─→ [Initial State] Horse list empty, track empty, panels empty
        └─→ [Click: Generate Program]
              └─→ 20 horses generated with random condition & color
              └─→ 6-round schedule created, 10 horses selected per round
              └─→ Program panel populated
              └─→ Horse List panel populated
                    └─→ [Click: Start]
                          └─→ Round 1 begins → horses animate across track
                          └─→ Round 1 finishes → Results panel shows Round 1 results
                          └─→ Round 2 begins → ...
                          └─→ ...
                          └─→ Round 6 finishes → All results shown, race complete
```

---

## 4. Screens / Pages

Single-page application — one route, one view.

| Panel | Location | Description |
|-------|----------|-------------|
| Horse List | Left | Scrollable table of all 20 horses with name, condition, color |
| Race Track | Center | Animated 10-lane track, current round display |
| Program | Right (left col) | 6-round schedule with per-round lineups |
| Results | Right (right col) | Completed round results, populated sequentially |
| Header | Top | App title + Generate Program button + Start/Pause button |

---

## 5. UI Layout

### Desktop (≥ 768px) — from design screenshot

```
┌─────────────────────────────────────────────────────────────────────┐
│  Horse Racing                  [GENERATE PROGRAM]    [START / PAUSE] │
├──────────────────┬──────────────────────────┬────────────┬──────────┤
│  Horse List      │     Race Track           │  Program   │ Results  │
│  (1–20)          │  (10 animated lanes)     │  (blue)    │ (green)  │
│                  │                          │            │          │
│  Name|Cond|Color │  1 ──────🐎──────[FINISH]│  Lap data  │ Lap data │
│  ...             │  2 ──🐎────────────      │            │          │
│  (scrollable)    │  ...                     │ (scroll)   │ (scroll) │
│                  │  1st Lap 1200m   FINISH  │            │          │
└──────────────────┴──────────────────────────┴────────────┴──────────┘
```

### Mobile (< 768px) — tab-based layout

Same content, reorganised into **4 tabs** with a sticky header:

```
┌─────────────────────────┐
│ Horse Racing  [GEN][▶⏸] │  ← sticky header, compact buttons
├─────────────────────────┤
│ [Horses][Track][Prog][Res]│  ← tab bar (bottom or top)
├─────────────────────────┤
│                         │
│   Active tab content    │  ← full screen, scrollable
│                         │
└─────────────────────────┘
```

| Tab | Content |
|-----|---------|
| Horses | Horse list table (name, condition, color) |
| Track | Race track — full-width, lanes scale to screen |
| Program | 6-round schedule |
| Results | Completed round results |

- Track tab is auto-activated when race starts
- Results tab gets a badge/dot when new results arrive while on another tab
- No touch gestures required — standard tap + scroll

---

## 6. Out of Scope (v1)

- No betting / wagering system
- No user accounts or persistence between sessions
- No sound effects
- No multiplayer
- No horse stat progression between rounds
- No replay functionality

---

## 2.7 Win Condition Algorithm

Horse positions are computed **per animation tick**, not pre-calculated. This creates realistic overtaking and visual drama.

```
tickStep = (condition / 100) * BASE_SPEED * (0.7 + Math.random() * 0.6)
```

- `condition / 100` — normalised condition as the base speed multiplier
- `BASE_SPEED` — constant (pixels/tick), scaled to track width and round distance
- `0.7 + Math.random() * 0.6` — variance factor in range [0.7, 1.3], meaning ±30% per tick
- A horse with condition 90 wins ~80% of races against condition 30, but upsets are possible

### Round Duration Strategy

All rounds have the **same screen duration (~45 seconds)**. `BASE_SPEED` is scaled per round so horses cover the full track width regardless of distance. However, longer rounds use **more ticks** to simulate the same animation, which means more variance accumulates and more overtaking occurs. This makes longer rounds feel more dramatic without making the user wait longer.

| Round | Distance | Ticks | Feel |
|-------|----------|-------|------|
| 1 | 1200 m | 150 | Fast, clean result |
| 2 | 1400 m | 175 | — |
| 3 | 1600 m | 200 | — |
| 4 | 1800 m | 225 | — |
| 5 | 2000 m | 250 | More overtaking |
| 6 | 2200 m | 275 | Maximum drama |

`BASE_SPEED = trackWidth / ticks` per round (recalculated at round start)

---

## 2.8 Horse Name Generation

- Names are **randomly generated** at program generation time from two word lists
- Format: `[Adjective] + [Noun]` — e.g. "Swift Arrow", "Iron Duke"
- All 20 names are guaranteed **unique** per session (shuffle + pick, no repeats)
- Names reset on each "Generate Program" click

### Word Lists

```ts
const ADJECTIVES = [
  'Swift', 'Iron', 'Golden', 'Dark', 'Silver',
  'Wild', 'Noble', 'Brave', 'Storm', 'Royal',
  'Lucky', 'Mighty', 'Shadow', 'Crimson', 'Fierce',
  'Proud', 'Silent', 'Flash', 'Thunder', 'Blazing',
]

const NOUNS = [
  'Arrow', 'Duke', 'Knight', 'Spirit', 'Star',
  'Wind', 'Champion', 'Legend', 'Glory', 'Prince',
  'Fury', 'Blaze', 'Crown', 'Valor', 'Comet',
  'Titan', 'Dancer', 'Phantom', 'Ranger', 'Falcon',
]
```

Generation logic: shuffle both lists, pair index-by-index → 20 unique combinations guaranteed.

---

## 7. Open Questions

_All questions resolved. SPEC is complete._
