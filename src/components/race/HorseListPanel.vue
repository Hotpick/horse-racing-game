<script setup lang="ts">
// @ai-generated
// Implements: TASK-025 — Build HorseListPanel component
// Spec ref:   SPEC.md §2.1, §4, §5
import { useRaceStore } from '@/stores/raceStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const store = useRaceStore()
</script>

<template>
  <section class="flex flex-col h-full overflow-hidden">
    <!-- Panel header — yellow background per design — SPEC.md §5 -->
    <div class="shrink-0 px-3 py-2 bg-panel-horses text-white font-semibold text-sm">
      Horse List (1–20)
    </div>

    <!-- Empty state — shown before generateProgram is called -->
    <div
      v-if="store.horses.length === 0"
      class="flex-1 flex items-center justify-center text-sm text-muted-foreground p-4 text-center"
    >
      Click "Generate Program" to create the horse pool.
    </div>

    <!-- Scrollable horse table -->
    <div v-else class="flex-1 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-8">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead class="w-16 text-center">Cond</TableHead>
            <TableHead class="w-10 text-center">Color</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(horse, index) in store.horses" :key="horse.id">
            <TableCell class="text-muted-foreground text-xs">{{ index + 1 }}</TableCell>
            <TableCell class="text-sm font-medium">{{ horse.name }}</TableCell>
            <TableCell class="text-center text-sm">{{ horse.condition }}</TableCell>
            <TableCell class="text-center">
              <!-- Color swatch — background-color matches horse.color — SPEC.md §2.1 -->
              <span
                class="inline-block w-4 h-4 rounded-full border border-border"
                :style="{ backgroundColor: horse.color }"
                :aria-label="horse.color"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </section>
</template>
