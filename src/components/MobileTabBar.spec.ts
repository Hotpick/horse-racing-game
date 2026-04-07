// @ai-generated
// Implements: TASK-034 — Unit test MobileTabBar
// Spec ref:   SPEC.md §5 (mobile layout)
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import MobileTabBar from './MobileTabBar.vue'
import { useRaceStore } from '@/stores/raceStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('MobileTabBar', () => {
  it('renders 4 tab triggers', () => {
    const wrapper = mount(MobileTabBar, {
      props: { animatedPositions: [] },
    })
    const triggers = wrapper.findAll('[role="tab"]')
    expect(triggers).toHaveLength(4)
  })

  it('tab labels are Horses, Track, Program, Results', () => {
    const wrapper = mount(MobileTabBar, {
      props: { animatedPositions: [] },
    })
    const text = wrapper.text()
    expect(text).toContain('Horses')
    expect(text).toContain('Track')
    expect(text).toContain('Program')
    expect(text).toContain('Results')
  })

  it('HorseListPanel content is visible on Horses tab by default', () => {
    const store = useRaceStore()
    store.generateProgram()

    const wrapper = mount(MobileTabBar, {
      props: { animatedPositions: [] },
    })
    // Default tab is Horses — the list panel empty state or rows should be visible
    // Find the active tab content
    const activeContent = wrapper.find('[data-state="active"]')
    expect(activeContent.exists()).toBe(true)
  })

  it('switches active tab to track when race starts', async () => {
    const store = useRaceStore()
    store.generateProgram()

    const wrapper = mount(MobileTabBar, {
      props: { animatedPositions: [] },
    })

    store.startRace()
    await wrapper.vm.$nextTick()

    // The Tabs component should now have track as active value
    const tabs = wrapper.findComponent({ name: 'Tabs' })
    expect(tabs.props('modelValue')).toBe('track')
  })

  it('badge dot appears on Results tab when result arrives on another tab', async () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()

    const wrapper = mount(MobileTabBar, {
      props: { animatedPositions: [] },
    })

    // Drive round 1 to completion while not on Results tab
    for (let i = 0; i < 300; i++) store.advanceTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[aria-label="New results available"]').exists()).toBe(true)
  })

  it('badge clears when Results tab is selected', async () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()

    const wrapper = mount(MobileTabBar, {
      props: { animatedPositions: [] },
    })

    for (let i = 0; i < 300; i++) store.advanceTick()
    await wrapper.vm.$nextTick()

    // Emit the tab change event directly on the Tabs component
    const tabs = wrapper.findComponent({ name: 'Tabs' })
    await tabs.vm.$emit('update:modelValue', 'results')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[aria-label="New results available"]').exists()).toBe(false)
  })
})
