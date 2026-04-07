// @ai-generated
// Implements: TASK-010 — Unit test horse name generator
// Spec ref:   SPEC.md §2.8
import { describe, it, expect } from 'vitest'
import { ADJECTIVES, NOUNS, generateHorseNames } from './horseNames'

describe('ADJECTIVES', () => {
  it('has exactly 20 entries', () => {
    expect(ADJECTIVES).toHaveLength(20)
  })
})

describe('NOUNS', () => {
  it('has exactly 20 entries', () => {
    expect(NOUNS).toHaveLength(20)
  })
})

describe('generateHorseNames', () => {
  it('returns exactly the requested count', () => {
    expect(generateHorseNames(20)).toHaveLength(20)
    expect(generateHorseNames(10)).toHaveLength(10)
    expect(generateHorseNames(1)).toHaveLength(1)
  })

  it('all names are unique within a single call', () => {
    const names = generateHorseNames(20)
    const unique = new Set(names)
    expect(unique.size).toBe(20)
  })

  it('each name matches the "Adjective Noun" format', () => {
    const names = generateHorseNames(20)
    for (const name of names) {
      expect(name).toMatch(/^\w+ \w+$/)
    }
  })

  it('each adjective comes from ADJECTIVES and each noun from NOUNS', () => {
    const names = generateHorseNames(20)
    for (const name of names) {
      const [adj, noun] = name.split(' ')
      expect(ADJECTIVES).toContain(adj)
      expect(NOUNS).toContain(noun)
    }
  })

  it('produces different orderings on repeated calls (shuffle works)', () => {
    // Run several times; the chance of all 20 being identical is (1/20!)^n ≈ 0
    const results = Array.from({ length: 5 }, () => generateHorseNames(20).join(','))
    const unique = new Set(results)
    expect(unique.size).toBeGreaterThan(1)
  })
})
