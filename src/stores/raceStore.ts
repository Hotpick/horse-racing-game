// @ai-generated
// Implements: TASK-019 — Implement raceStore
// Spec ref:   SPEC.md §2.3, §3, ARCHITECTURE.md §3.1
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { RaceStatus } from '@/types/gameState'
import type { RoundResult } from '@/types/gameState'
import type { Horse, HorsePosition } from '@/types/horse'
import type { RaceSchedule } from '@/types/race'
import { generateHorsePool } from '@/utils/generateHorsePool'
import { generateSchedule, TICKS_PER_ROUND } from '@/utils/generateSchedule'
import { computeTick, computeBaseSpeed, sortByFinishOrder } from '@/utils/raceEngine'

// Track width in abstract units — matches the 0–100 position scale used in HorsePosition.
// The race engine works in these units; the animation layer maps them to CSS pixels.
const TRACK_WIDTH = 100

export const useRaceStore = defineStore('race', () => {
  // --- State ---
  const status = ref<RaceStatus>(RaceStatus.Idle)
  const horses = ref<Horse[]>([])
  const schedule = ref<RaceSchedule | null>(null)
  const currentRoundIndex = ref(0)
  const positions = ref<HorsePosition[]>([])
  const results = ref<RoundResult[]>([])

  // --- Internal helpers ---

  function currentRound() {
    return schedule.value?.rounds[currentRoundIndex.value] ?? null
  }

  function initPositionsForRound() {
    const round = currentRound()
    if (!round) return
    positions.value = round.horseIds.map((id) => ({ horseId: id, position: 0 }))
  }

  // --- Actions ---

  /**
   * Generate the horse pool and schedule.
   * SPEC.md §3: sets status to Idle and populates horses + schedule.
   */
  function generateProgram() {
    status.value = RaceStatus.Generating
    horses.value = [...generateHorsePool()]
    schedule.value = generateSchedule(horses.value)
    currentRoundIndex.value = 0
    positions.value = []
    results.value = []
    status.value = RaceStatus.Idle
  }

  /**
   * Begin the race from round 1.
   * Resets positions to 0 and sets status to Running.
   */
  function startRace() {
    currentRoundIndex.value = 0
    initPositionsForRound()
    status.value = RaceStatus.Running
  }

  /** Freeze animation without clearing positions. */
  function pauseRace() {
    if (status.value === RaceStatus.Running) {
      status.value = RaceStatus.Paused
    }
  }

  /** Resume from the paused state. */
  function resumeRace() {
    if (status.value === RaceStatus.Paused) {
      status.value = RaceStatus.Running
    }
  }

  /**
   * Advance the race by one engine tick.
   * Called every 100ms by useRaceAnimation — ARCHITECTURE.md §4.1.
   *
   * If a horse reaches TRACK_WIDTH the round ends:
   *  - results are recorded
   *  - either the next round begins or the race finishes
   */
  function advanceTick() {
    if (status.value !== RaceStatus.Running) return

    const round = currentRound()
    if (!round) return

    // Ticks for this round determine base speed — SPEC.md §2.7
    const ticks = TICKS_PER_ROUND[currentRoundIndex.value] ?? 150
    const baseSpeed = computeBaseSpeed(TRACK_WIDTH, ticks)

    const roundHorses = horses.value.filter((h) => round.horseIds.includes(h.id))
    positions.value = computeTick(positions.value, roundHorses, baseSpeed)

    // Round ends when the leading horse crosses the finish line
    const finished = positions.value.some((p) => p.position >= TRACK_WIDTH)
    if (finished) {
      // Record results ordered by finish position
      results.value = [
        ...results.value,
        {
          roundNumber: round.number,
          positions: sortByFinishOrder(positions.value),
        },
      ]

      const nextIndex = currentRoundIndex.value + 1
      if (nextIndex >= (schedule.value?.rounds.length ?? 0)) {
        // All 6 rounds complete
        status.value = RaceStatus.Finished
      } else {
        currentRoundIndex.value = nextIndex
        initPositionsForRound()
        // Status stays Running — next round begins immediately
      }
    }
  }

  /** Reset everything back to the initial state. */
  function resetRace() {
    status.value = RaceStatus.Idle
    horses.value = []
    schedule.value = null
    currentRoundIndex.value = 0
    positions.value = []
    results.value = []
  }

  return {
    // State (readonly from outside — mutate only through actions)
    status,
    horses,
    schedule,
    currentRoundIndex,
    positions,
    results,
    // Actions
    generateProgram,
    startRace,
    pauseRace,
    resumeRace,
    advanceTick,
    resetRace,
  }
})
