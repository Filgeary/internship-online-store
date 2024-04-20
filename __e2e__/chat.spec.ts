import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test.describe('Chat', () => {
  test('Authentication and messaging', async ({ page }) => {
    const uuid = randomUUID();

    await page.goto('/');

    await test.step('goto chat', async () => {
      await page.getByRole('link', { name: 'Чат' }).click();
    });

    await test.step('redirect to login form without auth', async () => {
      await expect(page.getByRole('heading', { name: 'Вход' })).toBeVisible();
      await expect(page.locator('h2')).toContainText('Вход');
    });

    await test.step('fill login form', async () => {
      await page.locator('input[name="login"]').click();
      await page.locator('input[name="login"]').fill('test_5');
      await page.locator('input[name="password"]').click();
      await page.locator('input[name="password"]').fill('123456');
      // use timeout, if you have debounced input
      // but its better to disable all debounce/throttle with NODE_ENV.TEST
      // otherwise use code below
      // await page.waitForTimeout(500);
      await page.getByRole('button', { name: 'Войти' }).click();
    });

    await test.step('redirect back to chat after login', async () => {
      await page.waitForURL('**/chat');
      await expect(page).toHaveURL('/chat');
    });

    await test.step('messaging', async () => {
      await page.getByTestId('input-chat').click();
      await page.getByPlaceholder('Write a message...').fill('data-test-id' + ' / ' + uuid);
      await page.getByPlaceholder('Write a message...').click();
      await page.getByPlaceholder('Write a message...').press('Enter');
      await expect(page.locator('#root')).toContainText('data-test-id' + ' / ' + uuid);
    });

    await test.step('go to profile', async () => {
      await page.goto('/profile');
      await page.waitForURL('**/profile');
      await expect(page).toHaveURL('/profile');
    });

    await test.step('profile info', async () => {
      await expect(page.getByRole('heading', { name: 'Профиль' })).toBeVisible();
      await expect(page.locator('h3')).toContainText('Профиль');
      await expect(page.getByText('test_5@example.com')).toBeVisible();
      await expect(page.locator('#root')).toContainText('test_5@example.com');
    });
  });
});
