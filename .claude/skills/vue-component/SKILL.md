---
name: vue-component
description: "Generate Vue 3 components, composables, Pinia stores, and TypeScript types for the horse racing game. Use this skill whenever creating any new .vue file, composable (useXxx.ts), store (xxxStore.ts), or type definition. Triggers on: 'create a component', 'add a composable', 'write a store', 'create a Vue file', 'build the X component', 'implement useX', or any request to build a UI element, reusable logic unit, or data layer piece for the project. Always use this skill instead of writing Vue code from scratch."
---

# Vue Component Generator

Generates consistent, production-quality Vue 3 code for the horse racing game project. Every file this skill produces follows the same conventions so the codebase stays uniform as it grows.

## Project Context

- **Framework:** Vue 3, `<script setup lang="ts">` everywhere — Composition API only, never Options API
- **State:** Pinia stores in `src/stores/`
- **UI:** shadcn-vue components imported from `@/components/ui/` + Tailwind CSS utility classes
- **Types:** interfaces and enums in `src/types/`, imported by name everywhere
- **Testing:** co-located `*.spec.ts` with Vitest + Vue Test Utils
- **Responsive:** mobile-first — design for 375px, scale up with `sm:` / `md:` / `lg:` prefixes
- **Linting:** ESLint + Prettier — produced code must pass with no warnings

---

## Component Rules

1. Use `<script setup lang="ts">` — no `export default defineComponent()`
2. Props: `defineProps<{ propName: Type }>()` — no runtime validators
3. Emits: `defineEmits<{ eventName: [arg: Type] }>()` — typed event signatures
4. Never use `any` — use `unknown` + type guard, or define a proper interface
5. Use `computed()`, `watch()`, `ref()`, `reactive()` from Vue — not raw JS equivalents
6. Import shadcn-vue primitives (`Button`, `Table`, `Card`, etc.) from `@/components/ui/`
7. Tailwind for all styling; only add `<style scoped>` for CSS animations that can't be done with utilities
8. All template expressions must be readable — extract complex logic to `computed` properties

---

## AI Traceability

Every file produced by this skill must include an AI trace header. This is a project requirement.

For `.ts` / `.spec.ts` files — first lines:
```ts
// @ai-generated
// Implements: TASK-XXX — [task title from TASKS.md]
// Spec ref:   SPEC.md §[relevant section, e.g. §2.7]
```

For `.vue` files — inside `<script setup>`, first lines:
```ts
// @ai-generated
// Implements: TASK-XXX — [task title]
// Spec ref:   SPEC.md §[section]
```

Add inline comments for any non-trivial logic, referencing the spec formula or ARCHITECTURE.md decision. Example:
```ts
// Race tick formula — SPEC.md §2.7
// Variance [0.7, 1.3] gives ~30% upset chance for lower-condition horses
const step = (horse.condition / 100) * baseSpeed * (0.7 + Math.random() * 0.6)
```

---

## Output Format

For every request, produce all three artifacts:

### 1. The `.vue` file

Arrange `<script setup>` sections in this order:
```
// @ai-generated header → imports → type definitions → defineProps/defineEmits → composables/stores → refs/reactive → computed → functions → lifecycle hooks
```

### 2. Co-located unit test (`ComponentName.spec.ts`)

Always include at minimum:
- Component renders without errors
- Key props affect the rendered output
- Emitted events fire with correct payload

### 3. Usage example (inline comment or brief snippet)

Show the minimal parent usage with required props.

---

## Composable Rules

- File: `src/composables/useXxx.ts`
- Accepts config params, returns a plain typed object `{ state, actions }`
- Zero direct DOM access — all DOM interaction happens in components
- Always export the return type as a named interface

```ts
// Good pattern
export interface UseRaceEngineReturn {
  positions: Readonly<Ref<HorsePosition[]>>
  start: () => void
  pause: () => void
}

export function useRaceEngine(config: RaceConfig): UseRaceEngineReturn { ... }
```

---

## Store Rules

- File: `src/stores/xxxStore.ts`
- Use `defineStore('xxx', () => { ... })` setup store syntax — consistent with Composition API
- State: `ref()` / `reactive()` inside the setup function
- Export only the `useXxxStore` composable — never export the raw store definition
- Actions are plain functions defined inside the setup function
- No direct state mutation from outside — always go through actions

```ts
// Good pattern
export const useRaceStore = defineStore('race', () => {
  const status = ref<RaceStatus>('idle')
  const horses = ref<Horse[]>([])

  function startRace() { status.value = 'running' }

  return { status, horses, startRace }
})
```

---

## Type Rules

- File: `src/types/xxx.ts`
- Prefer `interface` over `type` for object shapes
- Use `enum` for fixed sets of string values (e.g., `RaceStatus`)
- Export everything as named exports — no default exports from type files

---

## Full Example

**Request:** "Create a HorseCard component showing name, condition bar, and color swatch. Emit `select` on click."

**`src/components/race/HorseCard.vue`**
```vue
<script setup lang="ts">
import type { Horse } from '@/types/horse'

const props = defineProps<{
  horse: Horse
  isSelected?: boolean
}>()

const emit = defineEmits<{
  select: [horseId: string]
}>()
</script>

<template>
  <div
    class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent"
    :class="isSelected ? 'border-primary bg-primary/5' : 'border-border'"
    @click="emit('select', horse.id)"
  >
    <div class="w-4 h-4 rounded-full shrink-0" :style="{ backgroundColor: horse.color }" />
    <span class="flex-1 text-sm font-medium truncate">{{ horse.name }}</span>
    <div class="flex items-center gap-1.5">
      <div class="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div class="h-full rounded-full bg-primary" :style="{ width: `${horse.condition}%` }" />
      </div>
      <span class="text-xs text-muted-foreground w-6 text-right">{{ horse.condition }}</span>
    </div>
  </div>
</template>
```

**`src/components/race/HorseCard.spec.ts`**
```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HorseCard from './HorseCard.vue'
import type { Horse } from '@/types/horse'

const mockHorse: Horse = { id: '1', name: 'Swift Arrow', condition: 80, color: '#e74c3c' }

describe('HorseCard', () => {
  it('renders horse name and condition', () => {
    const wrapper = mount(HorseCard, { props: { horse: mockHorse } })
    expect(wrapper.text()).toContain('Swift Arrow')
    expect(wrapper.text()).toContain('80')
  })

  it('emits select with horse id on click', async () => {
    const wrapper = mount(HorseCard, { props: { horse: mockHorse } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('select')?.[0]).toEqual(['1'])
  })

  it('applies selected styles when isSelected is true', () => {
    const wrapper = mount(HorseCard, { props: { horse: mockHorse, isSelected: true } })
    expect(wrapper.classes()).toContain('border-primary')
  })
})
```
