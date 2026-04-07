// @ai-generated
// Implements: TASK-013 — Implement horse pool generator
// Spec ref:   SPEC.md §2.1
import type { Horse } from '@/types/horse'
import { generateHorseNames } from './horseNames'
import { assignColors } from './horseColors'

/**
 * Generate the fixed pool of 20 horses for a session.
 * SPEC.md §2.1: 20 horses, unique name, unique color, condition 1–100.
 */
export function generateHorsePool(): readonly Horse[] {
  const names = generateHorseNames(20)
  const colors = assignColors(20)

  return Object.freeze(
    names.map((name, i) => ({
      // Index-based id — stable, unique, no external dependency
      id: `horse-${i + 1}`,
      name,
      // condition: random integer 1–100 inclusive — SPEC.md §2.1
      condition: Math.floor(Math.random() * 100) + 1,
      color: colors[i]!,
    })),
  )
}
