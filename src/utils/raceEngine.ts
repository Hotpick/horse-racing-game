// @ai-generated
// Implements: TASK-017 — Implement race engine
// Spec ref:   SPEC.md §2.7, ARCHITECTURE.md §4.1

// Using setInterval (not rAF) for engine ticks — deterministic, easy to unit test
// with vi.useFakeTimers(). See ARCHITECTURE.md §4.1.

import type { Horse, HorsePosition } from '@/types/horse'

/**
 * Compute base speed for a round.
 * SPEC.md §2.7: BASE_SPEED = trackWidth / ticksPerRound
 * Recalculated at the start of each round so all rounds have the same screen duration.
 */
export function computeBaseSpeed(trackWidth: number, ticks: number): number {
  return trackWidth / ticks
}

/**
 * Advance all horse positions by one engine tick.
 * SPEC.md §2.7: step = (condition / 100) * baseSpeed * (0.7 + rand * 0.6)
 * Variance range [0.7, 1.3] allows ~30% upsets for lower-condition horses.
 *
 * Returns a NEW array — does not mutate the input positions array.
 */
export function computeTick(
  positions: readonly HorsePosition[],
  horses: readonly Horse[],
  baseSpeed: number,
): HorsePosition[] {
  // Build a lookup map so we don't O(n²) search inside the map call
  const conditionByHorseId = new Map<string, number>(horses.map((h) => [h.id, h.condition]))

  return positions.map((pos) => {
    const condition = conditionByHorseId.get(pos.horseId) ?? 50
    // Race engine tick — SPEC.md §2.7
    const step = (condition / 100) * baseSpeed * (0.7 + Math.random() * 0.6)
    return { horseId: pos.horseId, position: pos.position + step }
  })
}

/**
 * Return the horseId of the horse furthest along the track.
 * A round ends when the leading horse's position >= trackWidth.
 */
export function getRoundWinner(positions: readonly HorsePosition[]): string {
  let leaderId = positions[0]?.horseId ?? ''
  let maxPos = positions[0]?.position ?? -Infinity

  for (const pos of positions) {
    if (pos.position > maxPos) {
      maxPos = pos.position
      leaderId = pos.horseId
    }
  }

  return leaderId
}

/**
 * Return positions sorted by finish order (highest position first).
 * Used to build RoundResult after a round completes.
 */
export function sortByFinishOrder(positions: readonly HorsePosition[]): HorsePosition[] {
  return [...positions].sort((a, b) => b.position - a.position)
}
