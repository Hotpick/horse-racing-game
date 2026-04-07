// @ai-generated
// Implements: TASK-022 — Unit test useRaceAnimation
// Spec ref:   SPEC.md §2.3, ARCHITECTURE.md §4.2
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useRaceAnimation } from './useRaceAnimation'
import type { UseRaceAnimationReturn } from './useRaceAnimation'
import { useRaceStore } from '@/stores/raceStore'

// Minimal host component so onUnmounted lifecycle works correctly
function makeHost() {
  return defineComponent({
    setup() {
      return useRaceAnimation()
    },
    template: '<div />',
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.useFakeTimers()

  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((_cb: FrameRequestCallback) => 1),
  )
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
  vi.stubGlobal('performance', { now: () => Date.now() })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('useRaceAnimation', () => {
  it('start() causes advanceTick to be called after 100ms interval', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()

    const wrapper = mount(makeHost())
    const anim = wrapper.vm as unknown as UseRaceAnimationReturn
    const advanceSpy = vi.spyOn(store, 'advanceTick')

    anim.start()
    expect(advanceSpy).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(advanceSpy).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(200)
    expect(advanceSpy).toHaveBeenCalledTimes(3)

    wrapper.unmount()
  })

  it('pause() stops the interval — advanceTick is not called after pause', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()

    const wrapper = mount(makeHost())
    const anim = wrapper.vm as unknown as UseRaceAnimationReturn
    const advanceSpy = vi.spyOn(store, 'advanceTick')

    anim.start()
    vi.advanceTimersByTime(100)
    expect(advanceSpy).toHaveBeenCalledTimes(1)

    anim.pause()
    vi.advanceTimersByTime(500)
    // No additional ticks after pause
    expect(advanceSpy).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('resume() restarts the interval', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()

    const wrapper = mount(makeHost())
    const anim = wrapper.vm as unknown as UseRaceAnimationReturn
    const advanceSpy = vi.spyOn(store, 'advanceTick')

    anim.start()
    vi.advanceTimersByTime(100)
    anim.pause()
    const callsAfterPause = advanceSpy.mock.calls.length

    anim.resume()
    vi.advanceTimersByTime(100)
    expect(advanceSpy.mock.calls.length).toBeGreaterThan(callsAfterPause)

    wrapper.unmount()
  })

  it('unmount cancels interval and rAF', () => {
    const store = useRaceStore()
    store.generateProgram()
    store.startRace()

    const clearSpy = vi.spyOn(globalThis, 'clearInterval')
    const cancelRafSpy = globalThis.cancelAnimationFrame as ReturnType<typeof vi.fn>

    const wrapper = mount(makeHost())
    const anim = wrapper.vm as unknown as UseRaceAnimationReturn
    anim.start()

    wrapper.unmount()

    expect(clearSpy).toHaveBeenCalled()
    expect(cancelRafSpy).toHaveBeenCalled()
  })
})
