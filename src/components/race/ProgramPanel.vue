<script setup lang="ts">
// @ai-generated
// Implements: TASK-029 — Build ProgramPanel component
// Spec ref:   SPEC.md §2.5, §4, §5
import { computed } from 'vue'
import { useRaceStore } from '@/stores/raceStore'

const store = useRaceStore()

// Ordinal labels for lap sub-headers — SPEC.md §2.5
const ORDINALS = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH']

// Build the display data: for each round, map horse ids → names
const lapSections = computed(() => {
  if (!store.schedule) return []
  const horseById = new Map(store.horses.map((h) => [h.id, h]))

  return store.schedule.rounds.map((round, i) => ({
    label: `${ORDINALS[i] ?? `${i + 1}TH`} Lap – ${round.distance}m`,
    horses: round.horseIds.map((id, pos) => ({
      position: pos + 1,
      name: horseById.get(id)?.name ?? id,
      color: horseById.get(id)?.color ?? '#888',
    })),
  }))
})
</script>

<template>
  <section class="flex flex-col h-full overflow-hidden">
    <!-- Blue header — SPEC.md §5 -->
    <div class="shrink-0 px-3 py-2 bg-panel-program text-white font-semibold text-sm">
      Program
    </div>

    <!-- Empty state -->
    <div
      v-if="lapSections.length === 0"
      class="flex-1 flex items-center justify-center text-sm text-muted-foreground p-4 text-center"
    >
      Generate a program to see the schedule.
    </div>

    <!-- Scrollable schedule — SPEC.md §2.5 -->
    <div v-else class="flex-1 overflow-y-auto text-xs">
      <div v-for="(lap, i) in lapSections" :key="i" class="mb-2">
        <!-- Colored sub-header per lap -->
        <div class="sticky top-0 px-2 py-1 bg-panel-program/80 text-white font-semibold">
          {{ lap.label }}
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
              v-for="horse in lap.horses"
              :key="horse.position"
              class="border-b border-border/40 hover:bg-accent/30"
            >
              <td class="py-0.5 px-2 text-muted-foreground">{{ horse.position }}</td>
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
