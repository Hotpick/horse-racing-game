// @ai-generated
// Implements: TASK-018 — Unit test race engine
// Spec ref:   SPEC.md §2.7
import { describe, it, expect } from 'vitest'
import { computeBaseSpeed, computeTick, getRoundWinner, sortByFinishOrder } from './raceEngine'
import type { Horse, HorsePosition } from '@/types/horse'

const horses: Horse[] = [
  { id: 'h1', name: 'Swift Arrow', condition: 90, color: '#ff0000' },
  { id: 'h2', name: 'Iron Duke', condition: 30, color: '#0000ff' },
  { id: 'h3', name: 'Golden Star', condition: 60, color: '#00ff00' },
]

const positions: HorsePosition[] = [
  { horseId: 'h1', position: 0 },
  { horseId: 'h2', position: 0 },
  { horseId: 'h3', position: 0 },
]

describe('computeBaseSpeed', () => {
  it('returns trackWidth / ticks', () => {
    expect(computeBaseSpeed(1000, 150)).toBeCloseTo(6.67, 2)
    expect(computeBaseSpeed(800, 200)).toBeCloseTo(4)
  })
})

describe('computeTick', () => {
  it('does not mutate the input positions array', () => {
    const before = positions.map((p) => ({ ...p }))
    computeTick(positions, horses, 5)
    expect(positions).toEqual(before)
  })

  it('returns a new array with the same length', () => {
    const result = computeTick(positions, horses, 5)
    expect(result).toHaveLength(positions.length)
    expect(result).not.toBe(positions)
  })

  it('all positions increase after a tick', () => {
    const result = computeTick(positions, horses, 5)
    result.forEach((newPos, i) => {
      expect(newPos.position).toBeGreaterThan(positions[i]!.position)
    })
  })

  it('higher-condition horse advances more on average (statistical)', () => {
    // Run many ticks — higher condition should yield higher total advancement
    let h1Total = 0
    let h2Total = 0
    const runs = 500
    for (let i = 0; i < runs; i++) {
      const start: HorsePosition[] = [
        { horseId: 'h1', position: 0 },
        { horseId: 'h2', position: 0 },
      ]
      const result = computeTick(start, horses, 10)
      h1Total += result[0]!.position
      h2Total += result[1]!.position
    }
    expect(h1Total).toBeGreaterThan(h2Total)
  })
})

describe('getRoundWinner', () => {
  it('returns the id of the horse with the highest position', () => {
    const current: HorsePosition[] = [
      { horseId: 'h1', position: 50 },
      { horseId: 'h2', position: 80 },
      { horseId: 'h3', position: 30 },
    ]
    expect(getRoundWinner(current)).toBe('h2')
  })

  it('works with a single horse', () => {
    expect(getRoundWinner([{ horseId: 'h1', position: 10 }])).toBe('h1')
  })
})

describe('sortByFinishOrder', () => {
  it('returns positions sorted highest-first', () => {
    const current: HorsePosition[] = [
      { horseId: 'h1', position: 50 },
      { horseId: 'h2', position: 80 },
      { horseId: 'h3', position: 30 },
    ]
    const sorted = sortByFinishOrder(current)
    expect(sorted[0]!.horseId).toBe('h2')
    expect(sorted[1]!.horseId).toBe('h1')
    expect(sorted[2]!.horseId).toBe('h3')
  })

  it('does not mutate the input array', () => {
    const current: HorsePosition[] = [
      { horseId: 'h1', position: 50 },
      { horseId: 'h2', position: 80 },
    ]
    const before = [...current]
    sortByFinishOrder(current)
    expect(current).toEqual(before)
  })
})
