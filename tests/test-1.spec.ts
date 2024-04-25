import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('div').filter({ hasText: /^405,83 Добавить$/ }).getByRole('button').click();
  await page.getByRole('button', { name: 'Ок' }).click();
  await page.getByText('товар / 405,83 ₽').click();
});
