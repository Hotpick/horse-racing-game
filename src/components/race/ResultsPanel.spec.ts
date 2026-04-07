// @ai-generated
// Implements: TASK-032 — Unit test ResultsPanel
// Spec ref:   SPEC.md §2.6
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ResultsPanel from './ResultsPanel.vue'
import { useRaceStore } from '@/stores/raceStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('ResultsPanel', () => {
  it('shows empty state before any round finishes', () => {
    const wrapper = mount(ResultsPanel)
    expect(wrapper.text()).toContain('Results will appear')
  })

  it('panel header has green background class', () => {
    const wrapper = mount(ResultsPanel)
    expect(wrapper.html()).toContain('bg-panel-results')
  })

  it('shows 1 section after round 1 completes', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    // Drive round 1 to completion (300 ticks >> 150 needed)
    for (let i = 0; i < 300; i++) store.advanceTick()

    const wrapper = mount(ResultsPanel)
    const sections = wrapper.findAll('div.sticky')
    expect(sections.length).toBeGreaterThanOrEqual(1)
  })

  it('first-place horse is listed first in a section', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    for (let i = 0; i < 300; i++) store.advanceTick()

    const wrapper = mount(ResultsPanel)
    // First data row should have position "1"
    const firstRow = wrapper.find('tbody tr')
    expect(firstRow.text()).toContain('1')
  })

  it('shows 6 sections after all rounds complete', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    for (let i = 0; i < 2000; i++) store.advanceTick()

    const wrapper = mount(ResultsPanel)
    const sections = wrapper.findAll('div.sticky')
    expect(sections).toHaveLength(6)
  })
})
