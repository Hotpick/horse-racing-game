// @ai-generated
// Implements: TASK-021 — Implement useRaceAnimation composable
// Spec ref:   SPEC.md §2.3, ARCHITECTURE.md §4.2
import { ref, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { useRaceStore } from '@/stores/raceStore'
import { RaceStatus } from '@/types/gameState'
import type { HorsePosition } from '@/types/horse'

export interface UseRaceAnimationReturn {
  animatedPositions: Readonly<Ref<HorsePosition[]>>
  start: () => void
  pause: () => void
  resume: () => void
}

/**
 * Drives the race loop using two timers:
 *  - setInterval at 100ms: calls raceStore.advanceTick() (engine ticks)
 *  - requestAnimationFrame: lerps animatedPositions toward the latest engine state
 *
 * This decoupling means the engine advances at a fixed rate (easy to test) while
 * the rendered positions update at 60fps for smooth animation. — ARCHITECTURE.md §4.2
 */
export function useRaceAnimation(): UseRaceAnimationReturn {
  const store = useRaceStore()

  // Positions smoothly interpolated between engine ticks — consumed by RaceTrack
  const animatedPositions = ref<HorsePosition[]>([])

  let intervalId: ReturnType<typeof setInterval> | null = null
  let rafId: number | null = null

  // Track the last timestamp for lerp delta calculation
  let lastRafTime = 0

  // How fast the animated position catches up to the engine position.
  // At 100ms tick interval and 60fps rAF, lerp factor of 0.15 gives smooth motion.
  const LERP_FACTOR = 0.15

  function rafLoop(timestamp: number) {
    const delta = timestamp - lastRafTime
    lastRafTime = timestamp

    // Guard against first frame with huge delta
    if (delta < 200) {
      const enginePositions = store.positions

      // Detect round transitions by checking horseIds, not just length.
      // Both old and new rounds have 10 horses so length check alone misses the swap.
      // If any horseId changed, snap immediately — no lerp on round boundary.
      const idsMatch =
        animatedPositions.value.length === enginePositions.length &&
        enginePositions.every((ep, i) => animatedPositions.value[i]?.horseId === ep.horseId)

      if (!idsMatch) {
        // New round started (or first frame) — snap to engine positions immediately
        animatedPositions.value = enginePositions.map((p) => ({ ...p }))
      } else {
        // Same round: lerp each horse toward the engine's current position — ARCHITECTURE.md §4.2
        animatedPositions.value = animatedPositions.value.map((anim, i) => {
          const engine = enginePositions[i]
          if (!engine) return anim
          return {
            horseId: engine.horseId, // always keep engine's horseId (defensive)
            position: anim.position + (engine.position - anim.position) * LERP_FACTOR,
          }
        })
      }
    }

    // Continue loop only while running
    if (store.status === RaceStatus.Running) {
      rafId = requestAnimationFrame(rafLoop)
    } else {
      rafId = null
    }
  }

  function startInterval() {
    if (intervalId !== null) return
    // Engine tick every 100ms — ARCHITECTURE.md §4.1
    intervalId = setInterval(() => {
      store.advanceTick()
      // Stop interval when race finishes or is paused
      if (store.status !== RaceStatus.Running) {
        stopInterval()
      }
    }, 100)
  }

  function stopInterval() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function startRaf() {
    if (rafId !== null) return
    lastRafTime = performance.now()
    rafId = requestAnimationFrame(rafLoop)
  }

  function stopRaf() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  function start() {
    // Sync animated positions to initial engine state (all zeros)
    animatedPositions.value = store.positions.map((p) => ({ ...p }))
    startInterval()
    startRaf()
  }

  function pause() {
    stopInterval()
    stopRaf()
    // Freeze animatedPositions in place — horses stop mid-track per SPEC.md §2.3
  }

  function resume() {
    startInterval()
    startRaf()
  }

  // Clean up on component unmount — no memory leaks
  onUnmounted(() => {
    stopInterval()
    stopRaf()
  })

  return { animatedPositions, start, pause, resume }
}
