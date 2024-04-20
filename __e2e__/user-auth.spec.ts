import { expect, test } from '@playwright/test';

test.describe('User', () => {
  test('Authentication', async ({ page }) => {
    await page.goto('/');

    await test.step('direct logining with form', async () => {
      await page.getByRole('button', { name: 'Вход' }).click();
      await page.locator('input[name="login"]').click();
      await page.locator('input[name="login"]').fill('test');
      await page.locator('input[name="password"]').click();
    });

    await test.step('incorrect password', async () => {
      await page.locator('input[name="password"]').fill('123'); // incorrect password
      await page.getByRole('button', { name: 'Войти' }).click();
      await expect(page.locator('form')).toContainText('Wrong login or password');
      await expect(page.getByTestId('profile-link')).not.toBeVisible();
    });

    await test.step('correct password', async () => {
      await page.locator('input[name="password"]').click();
      await page.locator('input[name="password"]').fill('123456'); // correct password
      // use timeout, if you have debounced input
      // but its better to disable all debounce/throttle with NODE_ENV.TEST
      // otherwise use code below
      // await page.waitForTimeout(500);
      await page.getByRole('button', { name: 'Войти' }).click();
    });

    await test.step('correct login & redirect to home', async () => {
      await page.waitForURL('**/');
      await expect(page).toHaveURL('/');
    });

    await test.step('goto profile', async () => {
      await page.getByTestId('profile-link').click();
      await page.waitForURL('**/profile');
      await expect(page).toHaveURL('/profile');
    });

    await test.step('profile page with username', async () => {
      await expect(page.getByRole('heading', { name: /профиль/i })).toBeVisible();
      await expect(page.getByTestId('profile-name')).toHaveText(/adminname/i);
    });
  });
});
