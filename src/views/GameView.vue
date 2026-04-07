<script setup lang="ts">
// @ai-generated
// Implements: TASK-035 — Build GameView
// Spec ref:   SPEC.md §4, §5, ARCHITECTURE.md §5
import { watch, computed } from 'vue'
import { useRaceStore } from '@/stores/raceStore'
import { useRaceAnimation } from '@/composables/useRaceAnimation'
import { RaceStatus } from '@/types/gameState'
import AppHeader from '@/components/AppHeader.vue'
import HorseListPanel from '@/components/race/HorseListPanel.vue'
import RaceTrack from '@/components/race/RaceTrack.vue'
import ProgramPanel from '@/components/race/ProgramPanel.vue'
import ResultsPanel from '@/components/race/ResultsPanel.vue'
import MobileTabBar from '@/components/MobileTabBar.vue'

const store = useRaceStore()
const { animatedPositions, start, pause, resume } = useRaceAnimation()

// Wire animation lifecycle to store status — ARCHITECTURE.md §4.2
watch(
  () => store.status,
  (status, prevStatus) => {
    if (status === RaceStatus.Running && prevStatus !== RaceStatus.Running) {
      if (prevStatus === RaceStatus.Paused) {
        resume()
      } else {
        start()
      }
    } else if (status === RaceStatus.Paused) {
      pause()
    }
  },
)

// Horses for the current round in round.horseIds order — so lane numbers
// match the position numbers shown in ProgramPanel (both follow the draw order).
const currentRoundHorses = computed(() => {
  const round = store.schedule?.rounds[store.currentRoundIndex]
  if (!round) return []
  const horseById = new Map(store.horses.map((h) => [h.id, h]))
  return round.horseIds.flatMap((id) => {
    const horse = horseById.get(id)
    return horse ? [horse] : []
  })
})
</script>

<template>
  <!-- Full viewport, no overflow — SPEC.md §5 -->
  <div class="h-screen overflow-hidden flex flex-col">
    <AppHeader />

    <!-- Desktop 4-panel grid — hidden below md — SPEC.md §5 -->
    <div class="hidden md:grid md:grid-cols-[220px_1fr_200px_200px] flex-1 overflow-hidden">
      <HorseListPanel />
      <RaceTrack
        :horses="currentRoundHorses"
        :animated-positions="animatedPositions"
      />
      <ProgramPanel />
      <ResultsPanel />
    </div>

    <!-- Mobile tab layout — hidden on md+ — SPEC.md §5 -->
    <div class="flex md:hidden flex-1 overflow-hidden">
      <MobileTabBar :animated-positions="animatedPositions" />
    </div>
  </div>
</template>
