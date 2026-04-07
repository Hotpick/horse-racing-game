// @ai-generated
// Implements: TASK-005 — Configure Playwright
// Spec ref:   SPEC.md §1
import { test, expect } from '@playwright/test'

test('smoke test — app loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Horse Racing/i)
})
