// @ai-generated
// Implements: TASK-015 — Implement race schedule generator
// Spec ref:   SPEC.md §2.2, §2.7
import type { Horse } from '@/types/horse'
import type { Round, RaceSchedule } from '@/types/race'

/** Race distances per round — SPEC.md §2.2 */
export const ROUND_DISTANCES: readonly number[] = [1200, 1400, 1600, 1800, 2000, 2200]

/**
 * Ticks per round — SPEC.md §2.7
 * Longer rounds use more ticks so variance accumulates and overtaking increases.
 */
export const TICKS_PER_ROUND: readonly number[] = [100, 115, 130, 145, 160, 175]

/**
 * Pick `count` random elements from `arr` without replacement.
 * Returns a new array — does not mutate input.
 */
function sampleWithoutReplacement<T>(arr: readonly T[], count: number): T[] {
  const copy = [...arr]
  const result: T[] = []
  for (let i = 0; i < count; i++) {
    const j = Math.floor(Math.random() * (copy.length - i))
    result.push(copy[j]!)
    // Swap picked element to the "used" zone at the end
    const last = copy[copy.length - 1 - i]!
    copy[j] = last
  }
  return result
}

/**
 * Generate the 6-round race schedule.
 * SPEC.md §2.2: 10 horses randomly selected per round (without replacement within
 * a round, but the same horse may appear in multiple rounds).
 */
export function generateSchedule(horses: readonly Horse[]): RaceSchedule {
  const rounds: Round[] = ROUND_DISTANCES.map((distance, i) => ({
    id: `round-${i + 1}`,
    number: i + 1,
    distance,
    // 10 unique horse ids per round — independent draw per round
    horseIds: sampleWithoutReplacement(horses, 10).map((h) => h.id),
  }))

  return { rounds }
}
