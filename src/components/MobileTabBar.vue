<script setup lang="ts">
// @ai-generated
// Implements: TASK-033 — Build MobileTabBar component
// Spec ref:   SPEC.md §5 (mobile layout)
import { ref, watch } from 'vue'
import { useRaceStore } from '@/stores/raceStore'
import { RaceStatus } from '@/types/gameState'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import HorseListPanel from '@/components/race/HorseListPanel.vue'
import RaceTrack from '@/components/race/RaceTrack.vue'
import ProgramPanel from '@/components/race/ProgramPanel.vue'
import ResultsPanel from '@/components/race/ResultsPanel.vue'
import type { HorsePosition } from '@/types/horse'

defineProps<{
  animatedPositions: HorsePosition[]
}>()

const store = useRaceStore()

type TabId = 'horses' | 'track' | 'program' | 'results'
const activeTab = ref<TabId>('horses')

// Badge dot on Results tab when new results arrive while not on Results tab
// TODO(TASK-033): cleared when Results tab is selected
const hasNewResults = ref(false)
watch(
  () => store.results.length,
  () => {
    if (activeTab.value !== 'results') {
      hasNewResults.value = true
    }
  },
)

function onTabChange(value: string | number) {
  activeTab.value = String(value) as TabId
  if (value === 'results') {
    hasNewResults.value = false
  }
}

// Auto-switch to Track tab when race starts — SPEC.md §5
watch(
  () => store.status,
  (status) => {
    if (status === RaceStatus.Running) {
      activeTab.value = 'track'
    }
  },
)

// Horses for current round (passed down to RaceTrack)
const currentRoundHorses = () => {
  const round = store.schedule?.rounds[store.currentRoundIndex]
  if (!round) return []
  return store.horses.filter((h) => round.horseIds.includes(h.id))
}
</script>

<template>
  <!-- Mobile-only — hidden on md+ screens — SPEC.md §5 -->
  <div class="block md:hidden h-full flex flex-col">
    <Tabs :model-value="activeTab" class="flex flex-col h-full" @update:model-value="onTabChange">
      <!-- Tab bar -->
      <TabsList class="shrink-0 w-full grid grid-cols-4 rounded-none h-10">
        <TabsTrigger value="horses" class="text-xs">Horses</TabsTrigger>
        <TabsTrigger value="track" class="text-xs">Track</TabsTrigger>
        <TabsTrigger value="program" class="text-xs">Program</TabsTrigger>
        <TabsTrigger value="results" class="relative text-xs">
          Results
          <!-- Badge dot — SPEC.md §5: Results tab badge -->
          <span
            v-if="hasNewResults"
            class="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"
            aria-label="New results available"
          />
        </TabsTrigger>
      </TabsList>

      <!-- Tab content panels — each fills remaining height -->
      <TabsContent value="horses" class="flex-1 overflow-hidden m-0">
        <HorseListPanel />
      </TabsContent>
      <TabsContent value="track" class="flex-1 overflow-hidden m-0">
        <RaceTrack
          :horses="currentRoundHorses()"
          :animated-positions="animatedPositions"
        />
      </TabsContent>
      <TabsContent value="program" class="flex-1 overflow-hidden m-0">
        <ProgramPanel />
      </TabsContent>
      <TabsContent value="results" class="flex-1 overflow-hidden m-0">
        <ResultsPanel />
      </TabsContent>
    </Tabs>
  </div>
</template>
