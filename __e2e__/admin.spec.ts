import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test.describe('Admin panel', () => {
  test('Authentication, catalog filtering & search, editing articles', async ({ page }) => {
    const uuid = randomUUID();

    await page.goto('/');

    await test.step('goto admin page', async () => {
      await page.getByRole('link', { name: 'Админка' }).click();
    });

    await test.step('redirect to login without auth', async () => {
      await page.waitForURL('**/login');
      await expect(page).toHaveURL('/login');
    });

    await test.step('fill login form', async () => {
      await page.locator('input[name="login"]').click();
      await page.locator('input[name="login"]').fill('test');
      await page.locator('input[name="password"]').click();
      await page.locator('input[name="password"]').fill('123456');
      // use timeout, if you have debounced input
      // but its better to disable all debounce/throttle with NODE_ENV.TEST
      // otherwise use code below
      // await page.waitForTimeout(500);
      await page.getByRole('button', { name: 'Войти' }).click();
    });

    await test.step('redirect to admin back with auth', async () => {
      await page.waitForURL('**/admin');
      await expect(page).toHaveURL('/admin');
    });

    await test.step('admin panel with content', async () => {
      await expect(page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible();
      await expect(page.locator('h1')).toContainText('Admin Panel');
    });

    await test.step('sider navigation to articles', async () => {
      await page.getByRole('menuitem', { name: 'number articles' }).click();
    });

    await test.step('catalog filters and search', async () => {
      await page.locator('div:nth-child(3) > .ant-select > .ant-select-selector').click();
      await page.getByTitle('United States').locator('div').first().click();
      await page.getByTitle('Russian Federation').locator('div').first().click();
      await page.locator('div').filter({ hasText: /^Все$/ }).nth(2).click();
      await page.getByText('- - Smartphones').click();
      await page.getByPlaceholder('Поиск').click();
      await page.getByPlaceholder('Поиск').fill('7');
      // use timeout, if you have debounced input
      // but its better to disable all debounce/throttle with NODE_ENV.TEST
      // otherwise use code below
      // await page.waitForTimeout(500);
    });

    await test.step('article editing & submit', async () => {
      await page.getByRole('button', { name: 'Редактировать' }).nth(0).click();
      await page.getByPlaceholder('Description').click();
      await page.getByPlaceholder('Description').press('Control+a');
      await page.getByPlaceholder('Description').fill(`data-testid / ${uuid}`);
      await page.getByRole('button', { name: 'Submit' }).click();
      await page.getByRole('button', { name: 'Cancel' }).click();
      await expect(page.getByRole('cell', { name: `data-testid / ${uuid}` })).toBeVisible();
      await expect(page.locator('tbody')).toContainText(`data-testid / ${uuid}`);
    });
  });
});
