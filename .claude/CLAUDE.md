# Horse Racing Game — Claude Instructions

This is an interactive horse racing simulation built with Vue 3. Before writing any code, read `SPEC.md` and `ARCHITECTURE.md` in the project root.

---

## Tech Stack

- **Vue 3** — `<script setup lang="ts">` only, never Options API
- **Pinia** — setup store syntax (`defineStore('x', () => { ... })`)
- **Vite** — build tool (no Vue Router — single view SPA)
- **TypeScript** — strict mode, no `any`
- **shadcn-vue** — UI components from `@/components/ui/`
- **Tailwind CSS** — utility-first, mobile-first (375px base)
- **Vitest** — unit tests, co-located as `*.spec.ts`
- **Playwright** — e2e tests in `e2e/`
- **ESLint + Prettier** — must pass with no warnings

---

## Project Structure

```
src/
├── components/
│   ├── race/        # Track, horse, countdown, results
│   ├── betting/     # (future v2) bet form, odds
│   └── ui/          # Re-exports from shadcn-vue
├── composables/     # useXxx.ts — reusable logic
├── stores/          # xxxStore.ts — Pinia stores
├── types/           # Interfaces, enums
├── utils/           # Pure functions (no Vue deps)
└── assets/
```

---

## Code Rules

- Props: `defineProps<{ ... }>()` — no runtime validators
- Emits: `defineEmits<{ event: [arg: Type] }>()` — typed
- Stores: export only `useXxxStore()`, never the raw definition
- Composables: return a plain typed object, no direct DOM access
- Types: `interface` for objects, `enum` for fixed string sets
- No `any` — use `unknown` + type guard if needed
- All styling via Tailwind — `<style scoped>` only for CSS animations

---

## Mobile Layout

- **< 768px (mobile):** tab-based — 4 tabs: Horses | Track | Program | Results
- **≥ 768px (desktop):** 4-panel grid side by side
- Always write **mobile-first** Tailwind — desktop overrides with `md:` prefix
- Track tab auto-activates when race starts; Results tab shows badge dot on new results

---

## Skills

Use the available skills instead of writing from scratch:

- **`vue-component`** — generating any `.vue`, composable, store, or type file
- **`task-writer`** — breaking SPEC sections into atomic tasks for TASKS.md
- **`frontend-design`** — visual design decisions: colors, spacing, layout, responsive patterns

---

## Key Game Logic

- **Horse pool:** 20 horses, each with unique color and condition score (1–100)
- **Race schedule:** 6 rounds (1200m → 1400m → 1600m → 1800m → 2000m → 2200m), 10 random horses per round
- **Win algorithm:** per-tick position update — `step = (condition / 100) * baseSpeed * (0.7 + Math.random() * 0.6)`
- **Engine:** fixed 100ms `setInterval` in `src/utils/raceEngine.ts` (pure, no Vue deps)
- **Animation:** `requestAnimationFrame` in `src/composables/useRaceAnimation.ts` — lerps between engine ticks
- **Pause:** freezes animation mid-track (cancels both rAF and interval)

---

## Workflow

Tasks are tracked in `TASKS.md`. Always:
1. Pick the next `[ ]` pending task
2. Implement it, write the paired test
3. **Run self-check** (see below) — fix all errors before proceeding
4. Mark as `[x]` before moving on

---

## Self-Check After Every File

After writing or editing any file, before marking the task as `[x]`, re-read what you just wrote and answer these questions honestly:

**1. Matches SPEC.md**
- Does the implementation do exactly what the spec describes — no more, no less?
- If the logic differs from SPEC (even "for the better") — that's a bug. Update SPEC first, then the code.

**2. Matches ARCHITECTURE.md**
- Is the file in the correct directory according to the project structure?
- Are the patterns followed (store syntax, composable return type, pure utils, etc.)?
- Is the separation of concerns intact — e.g. race engine logic did not leak into a component?

**3. Nothing extra added**
- Were any props, methods, state, or imports added that the current task does not require?
- Was anything built "for the future" that is not in TASKS.md?
- Rule: if a feature is not described in SPEC or the current task, it does not exist.

**4. Consistent with neighbouring files**
- If an interface changed (types, props, emits, store actions) — were all places that use it updated?

If any answer is "no" — fix it before moving to the next task.
