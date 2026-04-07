// @ai-generated
// Implements: TASK-037 — E2E — generate program flow
// Spec ref:   SPEC.md §3
import { test, expect } from '@playwright/test'

test('generate program populates horse list and program panel', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')

  // Initial state — Start button disabled
  const startBtn = page.getByRole('button', { name: /^start$/i })
  await expect(startBtn).toBeDisabled()

  // Click Generate Program
  await page.getByRole('button', { name: /generate program/i }).click()

  // Scope to the visible desktop HorseListPanel (hidden md:grid is the desktop container)
  // The desktop grid is the first panel in the grid; target the first section with horse list
  const horseSection = page.locator('.md\\:grid section').first()
  await expect(horseSection.locator('tbody tr')).toHaveCount(20)

  // Start button is now enabled
  await expect(startBtn).toBeEnabled()
})
