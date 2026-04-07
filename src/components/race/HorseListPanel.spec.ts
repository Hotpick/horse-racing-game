// @ai-generated
// Implements: TASK-026 — Unit test HorseListPanel
// Spec ref:   SPEC.md §2.1
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import HorseListPanel from './HorseListPanel.vue'
import { useRaceStore } from '@/stores/raceStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('HorseListPanel', () => {
  it('shows empty state when no horses exist', () => {
    const wrapper = mount(HorseListPanel)
    expect(wrapper.text()).toContain('Generate Program')
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('renders 20 rows when store has 20 horses', async () => {
    const store = useRaceStore()
    store.generateProgram()

    const wrapper = mount(HorseListPanel)
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(20)
  })

  it('first row shows correct horse name', async () => {
    const store = useRaceStore()
    store.generateProgram()

    const wrapper = mount(HorseListPanel)
    const firstRow = wrapper.findAll('tbody tr')[0]
    expect(firstRow?.text()).toContain(store.horses[0]!.name)
  })

  it('first row shows correct condition number', async () => {
    const store = useRaceStore()
    store.generateProgram()

    const wrapper = mount(HorseListPanel)
    const firstRow = wrapper.findAll('tbody tr')[0]
    expect(firstRow?.text()).toContain(String(store.horses[0]!.condition))
  })

  it('color swatch has a background-color style set', async () => {
    const store = useRaceStore()
    store.generateProgram()

    const wrapper = mount(HorseListPanel)
    const swatch = wrapper.find('tbody tr span')
    // jsdom converts hex → rgb, so just assert the style attribute is present
    expect(swatch?.attributes('style')).toMatch(/background-color/)
  })

  it('panel is scrollable (overflow-y-auto present)', async () => {
    const store = useRaceStore()
    store.generateProgram()

    const wrapper = mount(HorseListPanel)
    expect(wrapper.html()).toContain('overflow-y-auto')
  })
})
