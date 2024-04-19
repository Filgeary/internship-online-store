import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test('Admin: auth, catalog, editing articles', async ({ page }) => {
  const uuid = randomUUID();

  await page.goto('/');
  await page.getByRole('link', { name: 'Админка' }).click();

  // check redirect to login without auth
  await page.waitForURL('**/login');
  await expect(page).toHaveURL('/login');

  // check login form
  await page.locator('input[name="login"]').click();
  await page.locator('input[name="login"]').fill('test');
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill('123456');
  await page.getByRole('button', { name: 'Войти' }).click();

  // check redirect to admin with auth
  await page.waitForURL('**/admin');
  await expect(page).toHaveURL('/admin');

  // check admin panel
  await expect(page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible();
  await expect(page.locator('h1')).toContainText('Admin Panel');

  // check navigation
  await page.getByRole('menuitem', { name: 'number articles' }).click();

  // check filters and search
  await page.locator('div:nth-child(3) > .ant-select > .ant-select-selector').click();
  await page.getByTitle('United States').locator('div').first().click();
  await page.getByTitle('Russian Federation').locator('div').first().click();
  await page.locator('div').filter({ hasText: /^Все$/ }).nth(2).click();
  await page.getByText('- - Smartphones').click();
  await page.getByPlaceholder('Поиск').click();
  await page.getByPlaceholder('Поиск').fill('7');

  // check article editing
  await page.getByRole('button', { name: 'Редактировать' }).nth(0).click();
  await page.getByPlaceholder('Description').click();
  await page.getByPlaceholder('Description').press('Control+a');
  await page.getByPlaceholder('Description').fill(`data-testid / ${uuid}`);
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('cell', { name: `data-testid / ${uuid}` })).toBeVisible();
  await expect(page.locator('tbody')).toContainText(`data-testid / ${uuid}`);
});
