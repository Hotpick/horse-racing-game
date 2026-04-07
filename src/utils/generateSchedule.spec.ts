// @ai-generated
// Implements: TASK-016 — Unit test race schedule generator
// Spec ref:   SPEC.md §2.2
import { describe, it, expect } from 'vitest'
import { generateSchedule, ROUND_DISTANCES, TICKS_PER_ROUND } from './generateSchedule'
import type { Horse } from '@/types/horse'

const mockHorses: Horse[] = Array.from({ length: 20 }, (_, i) => ({
  id: `horse-${i + 1}`,
  name: `Horse ${i + 1}`,
  condition: 50,
  color: '#000000',
}))

describe('ROUND_DISTANCES', () => {
  it('has exactly 6 entries matching the spec', () => {
    expect(ROUND_DISTANCES).toEqual([1200, 1400, 1600, 1800, 2000, 2200])
  })
})

describe('TICKS_PER_ROUND', () => {
  it('has exactly 6 entries matching the spec', () => {
    expect(TICKS_PER_ROUND).toEqual([150, 175, 200, 225, 250, 275])
  })
})

describe('generateSchedule', () => {
  it('returns a schedule with exactly 6 rounds', () => {
    const schedule = generateSchedule(mockHorses)
    expect(schedule.rounds).toHaveLength(6)
  })

  it('each round has the correct distance', () => {
    const schedule = generateSchedule(mockHorses)
    schedule.rounds.forEach((round, i) => {
      expect(round.distance).toBe(ROUND_DISTANCES[i])
    })
  })

  it('each round has exactly 10 unique horse ids', () => {
    const schedule = generateSchedule(mockHorses)
    for (const round of schedule.rounds) {
      expect(round.horseIds).toHaveLength(10)
      expect(new Set(round.horseIds).size).toBe(10)
    }
  })

  it('all horse ids in rounds exist in the provided horses array', () => {
    const schedule = generateSchedule(mockHorses)
    const validIds = new Set(mockHorses.map((h) => h.id))
    for (const round of schedule.rounds) {
      for (const id of round.horseIds) {
        expect(validIds.has(id)).toBe(true)
      }
    }
  })

  it('round numbers are 1-based and sequential', () => {
    const schedule = generateSchedule(mockHorses)
    schedule.rounds.forEach((round, i) => {
      expect(round.number).toBe(i + 1)
    })
  })
})
