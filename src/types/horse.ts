// @ai-generated
// Implements: TASK-007 — Define core game TypeScript interfaces
// Spec ref:   SPEC.md §2.1

/** A single horse in the pool. The pool is fixed for the entire session. */
export interface Horse {
  id: string
  name: string
  /** Integer in range 1–100. Higher condition = faster average speed. */
  condition: number
  /** Unique hex color string, e.g. "#e74c3c". One color per horse. */
  color: string
}

/** Snapshot of one horse's position on the track during a race. */
export interface HorsePosition {
  horseId: string
  /** Percentage of track width covered, range 0–100. */
  position: number
}
