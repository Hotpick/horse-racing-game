// @ai-generated
// Implements: TASK-020 — Unit test raceStore
// Spec ref:   SPEC.md §2.3, §3
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRaceStore } from './raceStore'
import { RaceStatus } from '@/types/gameState'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('generateProgram', () => {
  it('populates 20 horses and a 6-round schedule', () => {
    const store = useRaceStore()
    store.generateProgram()
    expect(store.horses).toHaveLength(20)
    expect(store.schedule?.rounds).toHaveLength(6)
  })

  it('sets status back to Idle after generation', () => {
    const store = useRaceStore()
    store.generateProgram()
    expect(store.status).toBe(RaceStatus.Idle)
  })

  it('clears previous results on re-generate', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    // Force a result entry
    for (let i = 0; i < 300; i++) store.advanceTick()
    store.generateProgram()
    expect(store.results).toHaveLength(0)
  })
})

describe('startRace', () => {
  it('sets status to Running', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    expect(store.status).toBe(RaceStatus.Running)
  })

  it('resets all positions to 0', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    for (const pos of store.positions) {
      expect(pos.position).toBe(0)
    }
  })

  it('initialises 10 positions for round 1', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    expect(store.positions).toHaveLength(10)
  })
})

describe('pauseRace', () => {
  it('sets status to Paused', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    store.pauseRace()
    expect(store.status).toBe(RaceStatus.Paused)
  })

  it('does not clear positions when paused', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    store.advanceTick()
    const positionsBefore = store.positions.map((p) => p.position)
    store.pauseRace()
    const positionsAfter = store.positions.map((p) => p.position)
    expect(positionsAfter).toEqual(positionsBefore)
  })

  it('advanceTick does nothing while paused', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    store.advanceTick()
    const positionsBefore = store.positions.map((p) => p.position)
    store.pauseRace()
    store.advanceTick()
    const positionsAfter = store.positions.map((p) => p.position)
    expect(positionsAfter).toEqual(positionsBefore)
  })
})

describe('resumeRace', () => {
  it('sets status back to Running from Paused', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    store.pauseRace()
    store.resumeRace()
    expect(store.status).toBe(RaceStatus.Running)
  })
})

describe('advanceTick', () => {
  it('increases horse positions', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    const before = store.positions.map((p) => p.position)
    store.advanceTick()
    store.positions.forEach((pos, i) => {
      expect(pos.position).toBeGreaterThan(before[i]!)
    })
  })

  it('appends a result after a round completes', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    // 300 ticks is well beyond the 150-tick round 1 duration
    for (let i = 0; i < 300; i++) store.advanceTick()
    expect(store.results.length).toBeGreaterThanOrEqual(1)
  })

  it('sets status to Finished after all 6 rounds complete', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    // 2000 ticks is enough to exhaust all 6 rounds (max 275 ticks each)
    for (let i = 0; i < 2000; i++) store.advanceTick()
    expect(store.status).toBe(RaceStatus.Finished)
    expect(store.results).toHaveLength(6)
  })
})

describe('resetRace', () => {
  it('clears all state', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    store.resetRace()
    expect(store.status).toBe(RaceStatus.Idle)
    expect(store.horses).toHaveLength(0)
    expect(store.schedule).toBeNull()
    expect(store.positions).toHaveLength(0)
    expect(store.results).toHaveLength(0)
  })
})
