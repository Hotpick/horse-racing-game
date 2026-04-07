// @ai-generated
// Implements: TASK-028 — Unit test RaceTrack
// Spec ref:   SPEC.md §2.4
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import RaceTrack from './RaceTrack.vue'
import { useRaceStore } from '@/stores/raceStore'
import type { Horse, HorsePosition } from '@/types/horse'

const mockHorses: Horse[] = Array.from({ length: 10 }, (_, i) => ({
  id: `horse-${i + 1}`,
  name: `Horse ${i + 1}`,
  condition: 50,
  color: '#ff0000',
}))

const mockPositions: HorsePosition[] = mockHorses.map((h) => ({
  horseId: h.id,
  position: 0,
}))

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('RaceTrack', () => {
  it('renders exactly 10 lane elements when given 10 horses', () => {
    const wrapper = mount(RaceTrack, {
      props: { horses: mockHorses, animatedPositions: mockPositions },
    })
    // Each lane has a lane-number div
    const laneNumbers = wrapper.findAll('.bg-track-lane')
    expect(laneNumbers).toHaveLength(10)
  })

  it('horse at position 50 has left: 50% in its style', () => {
    const posAt50: HorsePosition[] = mockHorses.map((h, i) => ({
      horseId: h.id,
      position: i === 0 ? 50 : 0,
    }))
    const wrapper = mount(RaceTrack, {
      props: { horses: mockHorses, animatedPositions: posAt50 },
    })
    const firstHorse = wrapper.find('[data-horse-id="horse-1"]')
    // left: 50% positions the horse at 50% of the CONTAINER width — correct track placement
    expect(firstHorse.attributes('style')).toContain('left: 50%')
  })

  it('finish line element is visible', () => {
    const wrapper = mount(RaceTrack, {
      props: { horses: mockHorses, animatedPositions: mockPositions },
    })
    // Red finish line divs (one per lane + they share bg-red-500)
    expect(wrapper.html()).toContain('bg-red-500')
  })

  it('round label shows distance when schedule exists', async () => {
    const store = useRaceStore()
    store.generateProgram()

    const wrapper = mount(RaceTrack, {
      props: { horses: mockHorses, animatedPositions: mockPositions },
    })
    // Round 1 distance is 1200m
    expect(wrapper.text()).toContain('1200m')
  })
})
