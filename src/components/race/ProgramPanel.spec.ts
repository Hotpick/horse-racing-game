// @ai-generated
// Implements: TASK-030 — Unit test ProgramPanel
// Spec ref:   SPEC.md §2.5
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ProgramPanel from './ProgramPanel.vue'
import { useRaceStore } from '@/stores/raceStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('ProgramPanel', () => {
  it('shows empty state before program is generated', () => {
    const wrapper = mount(ProgramPanel)
    expect(wrapper.text()).toContain('Generate a program')
  })

  it('renders 6 lap sections after program is generated', async () => {
    const store = useRaceStore()
    store.generateProgram()

    const wrapper = mount(ProgramPanel)
    // Each section has a sub-header with ordinal + distance
    const headers = wrapper.findAll('div.sticky')
    expect(headers).toHaveLength(6)
  })

  it('first section header contains "1200m"', async () => {
    const store = useRaceStore()
    store.generateProgram()

    const wrapper = mount(ProgramPanel)
    const firstHeader = wrapper.findAll('div.sticky')[0]
    expect(firstHeader?.text()).toContain('1200m')
  })

  it('each section has exactly 10 rows', async () => {
    const store = useRaceStore()
    store.generateProgram()

    const wrapper = mount(ProgramPanel)
    const tables = wrapper.findAll('table')
    expect(tables).toHaveLength(6)
    for (const table of tables) {
      const rows = table.findAll('tbody tr')
      expect(rows).toHaveLength(10)
    }
  })

  it('panel header has blue background class', () => {
    const wrapper = mount(ProgramPanel)
    expect(wrapper.html()).toContain('bg-panel-program')
  })
})
