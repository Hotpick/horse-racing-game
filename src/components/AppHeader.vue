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

const isFinished = computed(() => store.status === RaceStatus.Finished)

// Start button is disabled until a program has been generated
const isStartDisabled = computed(() => store.schedule === null)

// Label cycles: Start → Pause → Resume → New Race
const startLabel = computed(() => {
  if (store.status === RaceStatus.Running) return 'Pause'
  if (store.status === RaceStatus.Paused) return 'Resume'
  if (store.status === RaceStatus.Finished) return 'New Race'
  return 'Start'
})

function handleStartPause() {
  if (store.status === RaceStatus.Running) {
    store.pauseRace()
  } else if (store.status === RaceStatus.Paused) {
    store.resumeRace()
  } else if (store.status === RaceStatus.Finished) {
    // Generate a fresh program — resets horses, schedule, and results
    store.generateProgram()
  } else {
    store.startRace()
  }
}
</script>

<template>
  <!--
    Mobile-first header layout:
    - < sm (375px): two rows — title row on top, buttons row on bottom
    - sm+ (640px+): single flex row, same as before
    No fixed h-14 on mobile so the two-row layout can breathe.
  -->
  <header
    class="sticky top-0 z-10 shadow-md px-4 py-2 sm:py-0 sm:h-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0"
    style="background-color: var(--color-header-bg, #e07060)"
  >
    <!-- Row 1 (mobile) / Left side (desktop): title + badge -->
    <div class="flex items-center gap-3">
      <h1 class="text-lg font-bold text-white tracking-wide leading-tight">Horse Racing</h1>
      <span
        v-if="isFinished"
        class="text-xs font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full whitespace-nowrap"
      >
        Race complete!
      </span>
    </div>

    <!-- Row 2 (mobile) / Right side (desktop): action buttons -->
    <div class="flex items-center gap-2 pb-1 sm:pb-0">
      <!--
        On mobile the buttons span the full row width so there is no overflow.
        On sm+ they shrink to content width (flex-1 is reset by sm:flex-none).
      -->
      <Button
        variant="secondary"
        size="sm"
        class="flex-1 sm:flex-none"
        :disabled="isGenerateDisabled"
        @click="store.generateProgram()"
      >
        <!-- Short label on mobile, full label on sm+ -->
        <span class="sm:hidden">Generate</span>
        <span class="hidden sm:inline">Generate Program</span>
      </Button>

      <Button
        variant="default"
        size="sm"
        class="flex-1 sm:flex-none"
        :disabled="isStartDisabled"
        @click="handleStartPause"
      >
        {{ startLabel }}
      </Button>
    </div>
  </header>
</template>
