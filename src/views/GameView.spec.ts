// @ai-generated
// Implements: TASK-036 — Unit test GameView
// Spec ref:   SPEC.md §4, §5
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import GameView from './GameView.vue'
import AppHeader from '@/components/AppHeader.vue'
import HorseListPanel from '@/components/race/HorseListPanel.vue'
import MobileTabBar from '@/components/MobileTabBar.vue'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.stubGlobal('requestAnimationFrame', vi.fn())
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  vi.stubGlobal('performance', { now: () => 0 })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('GameView', () => {
  it('renders AppHeader', () => {
    const wrapper = mount(GameView)
    expect(wrapper.findComponent(AppHeader).exists()).toBe(true)
  })

  it('renders HorseListPanel in the desktop grid', () => {
    const wrapper = mount(GameView)
    expect(wrapper.findComponent(HorseListPanel).exists()).toBe(true)
  })

  it('renders MobileTabBar', () => {
    const wrapper = mount(GameView)
    expect(wrapper.findComponent(MobileTabBar).exists()).toBe(true)
  })

  it('root div has h-screen and overflow-hidden', () => {
    const wrapper = mount(GameView)
    const root = wrapper.find('div')
    expect(root.classes()).toContain('h-screen')
    expect(root.classes()).toContain('overflow-hidden')
  })

  it('desktop grid is hidden below md (has hidden class)', () => {
    const wrapper = mount(GameView)
    // The desktop grid should have the "hidden" class (mobile-first)
    const desktopGrid = wrapper.find('.md\\:grid')
    expect(desktopGrid.classes()).toContain('hidden')
  })
})
