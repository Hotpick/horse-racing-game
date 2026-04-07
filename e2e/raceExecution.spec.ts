// @ai-generated
// Implements: TASK-038 — E2E — full race execution
// Spec ref:   SPEC.md §3
import { test, expect } from '@playwright/test'

test('full race completes with 6 result sections', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')

  await page.getByRole('button', { name: /generate program/i }).click()
  await page.getByRole('button', { name: /start/i }).click()

  // Wait for all 6 rounds to finish (each ~45s; give generous timeout via poll)
  // The race engine in tests runs at real-time 100ms intervals
  await expect(async () => {
    const sections = page.locator('.bg-panel-results\\/80')
    await expect(sections).toHaveCount(6)
  }).toPass({ timeout: 5 * 60 * 1000 })
})
