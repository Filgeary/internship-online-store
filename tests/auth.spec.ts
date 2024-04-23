import { test, expect } from '@playwright/test'

test.describe('Auth', () => {
  test('user-auth', async ({ page }) => {
    await page.goto('http://localhost:8010/')
    await page.getByRole('button', { name: 'Вход' }).click()
    await page
      .locator('div')
      .filter({ hasText: /^Логин$/ })
      .getByRole('textbox')
      .click()
    await page
      .locator('div')
      .filter({ hasText: /^Логин$/ })
      .getByRole('textbox')
      .fill('test_1')
    await page.locator('input[type="password"]').click()
    await page.locator('input[type="password"]').fill('123456')
    await page.getByRole('button', { name: 'Войти' }).click()
  })
})
