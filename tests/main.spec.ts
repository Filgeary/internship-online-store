import { test, expect } from '@playwright/test';

test.describe('Тестирование главной страницы', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000');
  });

  test('Показывается заголовок', async ({ page }) => {
    await expect(page.getByText(/магазин/i)).toBeVisible();
  });

  test('Админка - защищённый роут', async ({ page }) => {
    await page.getByRole('link', { name: 'админка' }).click();

    await expect(page).toHaveURL('http://localhost:5000/login');
  });

  test('Поиск товаров работает корректно', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/поиск/i);

    await searchInput.fill('книга');

    const bookElements = page.getByText(/книга/i, { exact: false });
    await bookElements.first().waitFor();

    await expect(bookElements.first()).toBeAttached();
  });

  test('Авторизация работает корректно', async ({ page }) => {
    await page.goto('http://localhost:5000/login');

    const loginInput = page.getByTestId('login-input');
    const passwordInput = page.getByTestId('password-input');
    const submitBtn = page.getByTestId('auth-submit-btn');

    await loginInput.fill('test_1');
    await passwordInput.fill('123456');
    await submitBtn.click();

    await page.waitForTimeout(5000);
  });
});
