import { test, expect } from '@playwright/test'

test.describe('Catalog', () => {
  test('test', async ({ page }) => {
    await page.goto('http://localhost:8010/')
    await page.getByRole('heading', { name: 'Магазин' }).click()
    await page.getByText('ГлавнаяЧатЛистопадРисованиеАдминка').click()
    await page.getByRole('link', { name: 'Главная' }).click()
    await page.locator('.Select-layout-input').click()
    await page.getByText('RUРоссия').click()
    await page.getByRole('img').click()
    await page.getByRole('button', { name: 'Сбросить' }).click()
  })
})
