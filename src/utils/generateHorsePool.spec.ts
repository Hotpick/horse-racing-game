// @ai-generated
// Implements: TASK-014 — Unit test horse pool generator
// Spec ref:   SPEC.md §2.1
import { describe, it, expect } from 'vitest'
import { generateHorsePool } from './generateHorsePool'

describe('generateHorsePool', () => {
  it('returns exactly 20 horses', () => {
    expect(generateHorsePool()).toHaveLength(20)
  })

  it('all ids are unique', () => {
    const pool = generateHorsePool()
    expect(new Set(pool.map((h) => h.id)).size).toBe(20)
  })

  it('all names are unique', () => {
    const pool = generateHorsePool()
    expect(new Set(pool.map((h) => h.name)).size).toBe(20)
  })

  it('all colors are unique', () => {
    const pool = generateHorsePool()
    expect(new Set(pool.map((h) => h.color)).size).toBe(20)
  })

  it('all condition values are integers between 1 and 100 inclusive', () => {
    const pool = generateHorsePool()
    for (const horse of pool) {
      expect(horse.condition).toBeGreaterThanOrEqual(1)
      expect(horse.condition).toBeLessThanOrEqual(100)
      expect(Number.isInteger(horse.condition)).toBe(true)
    }
  })
})
