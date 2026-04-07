<script setup lang="ts">
// @ai-generated
// Implements: TASK-027 — Build RaceTrack component
// Spec ref:   SPEC.md §2.4, §5
import { computed } from 'vue'
import { useRaceStore } from '@/stores/raceStore'
import type { Horse, HorsePosition } from '@/types/horse'
import HorseIcon from './HorseIcon.vue'

const props = defineProps<{
  horses: Horse[]
  animatedPositions: HorsePosition[]
}>()

const store = useRaceStore()

// Map horseId → animated position for O(1) lookup in template
const positionMap = computed(() => {
  const map = new Map<string, number>()
  for (const p of props.animatedPositions) {
    map.set(p.horseId, p.position)
  }
  return map
})

// Ordinal label for the current round — SPEC.md §2.4
const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th', '6th']
const roundLabel = computed(() => {
  const round = store.schedule?.rounds[store.currentRoundIndex]
  if (!round) return ''
  const ordinal = ORDINALS[store.currentRoundIndex] ?? `${store.currentRoundIndex + 1}th`
  return `${ordinal} Lap ${round.distance}m`
})

// Clamp position to [0, 95] so the horse icon never overflows the track
function clampedPosition(horseId: string): number {
  const pos = positionMap.value.get(horseId) ?? 0
  return Math.min(pos, 95)
}
</script>

<template>
  <section class="flex flex-col h-full overflow-hidden bg-track-bg">
    <!-- 10 lanes — one per horse in current round — SPEC.md §2.4 -->
    <div class="flex-1 overflow-hidden flex flex-col">
      <div
        v-for="(horse, index) in horses"
        :key="horse.id"
        class="flex flex-1 items-center border-b border-black/20 relative"
        :class="index % 2 === 0 ? 'bg-track-bg' : 'bg-track-lane-alt'"
      >
        <!-- Lane number strip — dark green — SPEC.md §2.4 -->
        <div
          class="w-7 shrink-0 h-full flex items-center justify-center bg-track-lane text-white text-xs font-bold"
        >
          {{ index + 1 }}
        </div>

        <!-- Track area -->
        <div class="flex-1 relative h-full">
          <!-- SVG horse silhouette — colored with horse.color so it matches the horse list swatch -->
          <span
            class="absolute top-1/2 select-none transition-none text-black"
            :style="{ left: `${clampedPosition(horse.id)}%`, transform: 'translateY(-50%)' }"
            :data-horse-id="horse.id"
          >
            <HorseIcon :size="56" />
          </span>

          <!-- Colored lane stripe for horse identity -->
          <div
            class="absolute bottom-0 left-0 right-0 h-1 opacity-70"
            :style="{ backgroundColor: horse.color }"
          />
        </div>

        <!-- Red FINISH line on the right edge — SPEC.md §2.4 -->
        <div class="w-1 shrink-0 h-full bg-red-500" />
      </div>
    </div>

    <!-- Bottom label row — SPEC.md §2.4 -->
    <div class="shrink-0 flex items-center justify-between px-3 py-1 bg-black/30 text-white text-xs">
      <span>{{ roundLabel }}</span>
      <span class="font-bold text-red-400">FINISH</span>
    </div>
  </section>
</template>
