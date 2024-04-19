import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test('Chat auth and messaging', async ({ page }) => {
  const uuid = randomUUID();

  await page.goto('/');
  await page.getByRole('link', { name: 'Чат' }).click();

  // check redirect to login form
  await expect(page.getByRole('heading', { name: 'Вход' })).toBeVisible();
  await expect(page.locator('h2')).toContainText('Вход');

  // fill login form
  await page.locator('input[name="login"]').click();
  await page.locator('input[name="login"]').fill('test_5');
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill('123456');
  await page.getByRole('button', { name: 'Войти' }).click();

  // check redirect to chat
  await page.waitForURL('**/chat');
  await expect(page).toHaveURL('/chat');

  // check messaging
  await page.getByTestId('input-chat').click();
  await page.getByPlaceholder('Write a message...').fill('data-test-id' + ' / ' + uuid);
  await page.getByPlaceholder('Write a message...').click();
  await page.getByPlaceholder('Write a message...').press('Enter');
  await expect(page.locator('#root')).toContainText('data-test-id' + ' / ' + uuid);

  // go to profile
  await page.goto('/profile');
  await page.waitForURL('**/profile');
  await expect(page).toHaveURL('/profile');

  // check profile info
  await expect(page.getByRole('heading', { name: 'Профиль' })).toBeVisible();
  await expect(page.locator('h3')).toContainText('Профиль');
  await expect(page.getByText('test_5@example.com')).toBeVisible();
  await expect(page.locator('#root')).toContainText('test_5@example.com');
});
