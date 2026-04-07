<script setup lang="ts">
// @ai-generated
// Implements: TASK-023 — Build AppHeader component
// Spec ref:   SPEC.md §4, §5
import { computed } from 'vue'
import { useRaceStore } from '@/stores/raceStore'
import { RaceStatus } from '@/types/gameState'
import { Button } from '@/components/ui/button'

const store = useRaceStore()

// "Generate Program" is disabled while a race is in progress
const isGenerateDisabled = computed(
  () => store.status === RaceStatus.Running || store.status === RaceStatus.Paused,
)

// Start button is disabled until a program has been generated
const isStartDisabled = computed(() => store.schedule === null)

// Label cycles: Start → Pause → Resume — SPEC.md §2.3
const startLabel = computed(() => {
  if (store.status === RaceStatus.Running) return 'Pause'
  if (store.status === RaceStatus.Paused) return 'Resume'
  return 'Start'
})

function handleStartPause() {
  if (store.status === RaceStatus.Running) {
    store.pauseRace()
  } else if (store.status === RaceStatus.Paused) {
    store.resumeRace()
  } else {
    store.startRace()
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-10 flex h-14 items-center justify-between px-4 shadow-md"
    style="background-color: var(--color-header-bg, #e07060)"
  >
    <h1 class="text-lg font-bold text-white tracking-wide">Horse Racing</h1>

    <div class="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        :disabled="isGenerateDisabled"
        @click="store.generateProgram()"
      >
        Generate Program
      </Button>

      <Button
        variant="default"
        size="sm"
        :disabled="isStartDisabled"
        @click="handleStartPause"
      >
        {{ startLabel }}
      </Button>
    </div>
  </header>
</template>
