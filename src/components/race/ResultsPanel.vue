<script setup lang="ts">
// @ai-generated
// Implements: TASK-031 — Build ResultsPanel component
// Spec ref:   SPEC.md §2.6, §4, §5
import { computed } from 'vue'
import { useRaceStore } from '@/stores/raceStore'

const store = useRaceStore()

const ORDINALS = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH']

// Build display sections from completed results — populated round by round
const resultSections = computed(() => {
  const horseById = new Map(store.horses.map((h) => [h.id, h]))

  return store.results.map((result) => ({
    label: `${ORDINALS[result.roundNumber - 1] ?? `${result.roundNumber}TH`} Lap`,
    horses: result.positions.map((pos, finishIndex) => ({
      finishPosition: finishIndex + 1,
      name: horseById.get(pos.horseId)?.name ?? pos.horseId,
      color: horseById.get(pos.horseId)?.color ?? '#888',
    })),
  }))
})
</script>

<template>
  <section class="flex flex-col h-full overflow-hidden">
    <!-- Green header — SPEC.md §5 -->
    <div class="shrink-0 px-3 py-2 bg-panel-results text-white font-semibold text-sm">
      Results
    </div>

    <!-- Empty state before any round finishes -->
    <div
      v-if="resultSections.length === 0"
      class="flex-1 flex items-center justify-center text-sm text-muted-foreground p-4 text-center"
    >
      Results will appear here after each round finishes.
    </div>

    <!-- Scrollable results — populated round by round — SPEC.md §2.6 -->
    <div v-else class="flex-1 overflow-y-auto text-xs">
      <div v-for="(section, i) in resultSections" :key="i" class="mb-2">
        <div class="sticky top-0 px-2 py-1 bg-panel-results/80 text-white font-semibold">
          {{ section.label }}
        </div>
        <table class="w-full">
          <thead>
            <tr class="text-muted-foreground border-b border-border">
              <th class="py-0.5 px-2 text-left w-8">Pos</th>
              <th class="py-0.5 px-2 text-left">Name</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="horse in section.horses"
              :key="horse.finishPosition"
              class="border-b border-border/40 hover:bg-accent/30"
            >
              <td class="py-0.5 px-2 text-muted-foreground">{{ horse.finishPosition }}</td>
              <td class="py-0.5 px-2 flex items-center gap-1.5">
                <span
                  class="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                  :style="{ backgroundColor: horse.color }"
                />
                {{ horse.name }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
