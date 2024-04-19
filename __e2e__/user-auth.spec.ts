import { expect, test } from '@playwright/test';

test('User authentication', async ({ page }) => {
  await page.goto('/');

  // check login form
  await page.getByRole('button', { name: 'Вход' }).click();
  await page.locator('input[name="login"]').click();
  await page.locator('input[name="login"]').fill('test');
  await page.locator('input[name="password"]').click();

  // check incorrect password
  await page.locator('input[name="password"]').fill('123'); // incorrect password
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(page.locator('form')).toContainText('Wrong login or password');
  await expect(page.getByTestId('profile-link')).not.toBeVisible();

  // check correct password
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill('123456'); // correct password
  // use timeout with debounced input
  // await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Войти' }).click();

  // check correct login & redirect
  await page.waitForURL('**/');
  await expect(page).toHaveURL('/');

  await page.getByTestId('profile-link').click();
  await page.waitForURL('**/profile');
  await expect(page).toHaveURL('/profile');

  // check profile page with username
  await expect(page.getByRole('heading', { name: /профиль/i })).toBeVisible();
  await expect(page.getByTestId('profile-name')).toHaveText(/adminname/i);
});
