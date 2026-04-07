// @ai-generated
// Implements: TASK-024 — Unit test AppHeader
// Spec ref:   SPEC.md §4
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import AppHeader from './AppHeader.vue'
import { useRaceStore } from '@/stores/raceStore'
import { RaceStatus } from '@/types/gameState'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('AppHeader', () => {
  it('renders the title "Horse Racing"', () => {
    const wrapper = mount(AppHeader)
    expect(wrapper.text()).toContain('Horse Racing')
  })

  it('renders Generate Program and Start buttons', () => {
    const wrapper = mount(AppHeader)
    expect(wrapper.text()).toContain('Generate Program')
    expect(wrapper.text()).toContain('Start')
  })

  it('Start button is disabled before program is generated', () => {
    const wrapper = mount(AppHeader)
    const buttons = wrapper.findAll('button')
    const startBtn = buttons.find((b) => b.text() === 'Start')
    expect(startBtn?.attributes('disabled')).toBeDefined()
  })

  it('Generate Program is disabled when status is Running', async () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()

    const wrapper = mount(AppHeader)
    const buttons = wrapper.findAll('button')
    const genBtn = buttons.find((b) => b.text() === 'Generate Program')
    expect(genBtn?.attributes('disabled')).toBeDefined()
  })

  it('Start button shows "Pause" when Running', async () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()

    const wrapper = mount(AppHeader)
    expect(wrapper.text()).toContain('Pause')
  })

  it('Start button shows "Resume" when Paused', async () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()
    store.pauseRace()

    const wrapper = mount(AppHeader)
    expect(wrapper.text()).toContain('Resume')
  })

  it('clicking Generate Program calls store.generateProgram', async () => {
    const store = useRaceStore()
    const wrapper = mount(AppHeader)
    const buttons = wrapper.findAll('button')
    const genBtn = buttons.find((b) => b.text() === 'Generate Program')
    await genBtn?.trigger('click')
    expect(store.status).toBe(RaceStatus.Idle)
    expect(store.horses).toHaveLength(20)
  })
})
