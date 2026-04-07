// @ai-generated
// Implements: TASK-040 — E2E — mobile tab navigation
// Spec ref:   SPEC.md §5 (mobile layout)
import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 375, height: 812 } })

test('mobile layout shows tab bar, desktop grid is hidden', async ({ page }) => {
  await page.goto('/')

  // Desktop grid should not be visible at 375px
  const desktopGrid = page.locator('.md\\:grid').first()
  await expect(desktopGrid).toBeHidden()

  // Tab bar should be visible
  const tabBar = page.getByRole('tablist')
  await expect(tabBar).toBeVisible()

  // 4 tabs
  const tabs = page.getByRole('tab')
  await expect(tabs).toHaveCount(4)
})

test('clicking Horses tab shows horse list content', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /generate program/i }).click()

  await page.getByRole('tab', { name: /horses/i }).click()
  // After generate, horse list rows should be visible inside the active tab content
  const activeContent = page.locator('[data-state="active"] tbody tr').first()
  await expect(activeContent).toBeVisible()
})

test('starting race auto-switches to Track tab', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /generate program/i }).click()
  await page.getByRole('button', { name: /start/i }).click()

  // Track tab should now be active — horse emoji should be visible
  await expect(page.getByRole('tab', { name: /track/i })).toHaveAttribute(
    'data-state',
    'active',
  )
})
