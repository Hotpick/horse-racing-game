// @ai-generated
// Implements: TASK-012 — Unit test horse color palette
// Spec ref:   SPEC.md §2.1
import { describe, it, expect } from 'vitest'
import { HORSE_COLORS, assignColors } from './horseColors'

describe('HORSE_COLORS', () => {
  it('has exactly 20 entries', () => {
    expect(HORSE_COLORS).toHaveLength(20)
  })

  it('all entries are valid hex colors', () => {
    for (const color of HORSE_COLORS) {
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })

  it('has no duplicate colors', () => {
    expect(new Set(HORSE_COLORS).size).toBe(20)
  })
})

describe('assignColors', () => {
  it('returns the requested count', () => {
    expect(assignColors(20)).toHaveLength(20)
    expect(assignColors(10)).toHaveLength(10)
  })

  it('returns no duplicate colors within a call', () => {
    const colors = assignColors(20)
    expect(new Set(colors).size).toBe(20)
  })

  it('all returned colors are valid hex strings from the palette', () => {
    const colors = assignColors(10)
    for (const color of colors) {
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(HORSE_COLORS).toContain(color)
    }
  })
})
