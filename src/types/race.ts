// @ai-generated
// Implements: TASK-007 — Define core game TypeScript interfaces
// Spec ref:   SPEC.md §2.2

/** One round in the 6-round race schedule. */
export interface Round {
  id: string
  /** 1-based round number (1–6). */
  number: number
  /** Race distance in metres (1200 | 1400 | 1600 | 1800 | 2000 | 2200). */
  distance: number
  /** IDs of the 10 horses selected for this round. Immutable after generation. */
  horseIds: readonly string[]
}

/** The full 6-round schedule generated before the race starts. */
export interface RaceSchedule {
  rounds: readonly Round[]
}
