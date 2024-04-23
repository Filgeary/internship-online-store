import { test, expect } from '@playwright/test'

test('canvas', async ({ page }) => {
  await page.goto('http://localhost:8010/')
  await page.getByRole('link', { name: 'Рисование' }).click()
  await expect(page).toHaveScreenshot()
})
