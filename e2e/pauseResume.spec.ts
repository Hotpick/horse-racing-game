// @ai-generated
// Implements: TASK-039 — E2E — pause and resume mid-race
// Spec ref:   SPEC.md §2.3
import { test, expect } from '@playwright/test'

test('pause freezes positions and resume restarts them', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')

  await page.getByRole('button', { name: /generate program/i }).click()
  await page.getByRole('button', { name: /start/i }).click()

  // Wait a moment for horses to move
  await page.waitForTimeout(1000)

  // Pause
  await page.getByRole('button', { name: /pause/i }).click()
  await expect(page.getByRole('button', { name: /resume/i })).toBeVisible()

  // Capture a horse position
  const horse = page.locator('[data-horse-id]').first()
  const styleBefore = await horse.getAttribute('style')

  // Wait 2 seconds — positions should not change
  await page.waitForTimeout(2000)
  const styleAfter = await horse.getAttribute('style')
  expect(styleAfter).toBe(styleBefore)

  // Resume
  await page.getByRole('button', { name: /resume/i }).click()
  await expect(page.getByRole('button', { name: /pause/i })).toBeVisible()

  // Wait a moment and verify positions changed
  await page.waitForTimeout(500)
  const styleAfterResume = await horse.getAttribute('style')
  expect(styleAfterResume).not.toBe(styleBefore)
})
