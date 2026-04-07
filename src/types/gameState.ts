// @ai-generated
// Implements: TASK-008 — Define RaceStatus enum and game state types
// Spec ref:   SPEC.md §3, ARCHITECTURE.md §6
import type { Horse, HorsePosition } from './horse'
import type { RaceSchedule } from './race'

/**
 * All possible states of the race application.
 * Using enum (not string union) per ARCHITECTURE.md §6.
 */
export enum RaceStatus {
  Idle = 'Idle',
  Generating = 'Generating',
  Running = 'Running',
  Paused = 'Paused',
  Finished = 'Finished',
}

/**
 * Finish positions for a single completed round.
 * Positions array is ordered: index 0 = 1st place.
 */
export interface RoundResult {
  roundNumber: number
  /** Horses ordered by finish position (index 0 = winner). */
  positions: HorsePosition[]
}

/** Top-level game state — consumed by raceStore (TASK-019). */
export interface GameState {
  status: RaceStatus
  /** 0-based index into schedule.rounds for the current/next round. */
  currentRoundIndex: number
  horses: Horse[]
  schedule: RaceSchedule | null
  results: RoundResult[]
}
