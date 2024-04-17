import { test, expect } from '@playwright/test';

test.describe('Тестирование главной страницы', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Показывается заголовок', async ({ page }) => {
    await expect(page.getByText(/магазин/i)).toBeVisible();
  });

  test('Админка - защищённый роут', async ({ page }) => {
    await page.getByRole('link', { name: 'админка' }).click();

    await expect(page).toHaveURL('/login');
  });

  test('Поиск товаров работает корректно', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/поиск/i);

    await searchInput.fill('книга');

    const bookElements = page.getByText(/книга/i, { exact: false });
    await bookElements.first().waitFor();

    await expect(bookElements.first()).toBeAttached();
  });

  test('Авторизация работает корректно', async ({ page }) => {
    await page.goto('/login');

    await page.route('*/**/sign', async (route) => {
      const json = {
        result: {
          token: '46db0ceeac4824a48321ef2510e3ea4a1091d5dfcb4c30fa3bc3710ccc4bd3f2',
          user: {
            _id: '65f8321af3360f03347a5fe2',
            _key: 'test-1',
            username: 'test_1',
            email: 'test_1@example.com',
            roles: [
              {
                _id: '65f8321af3360f03347a5fd9',
                _type: 'role',
              },
            ],
            profile: {
              name: 'User №1',
              surname: 'UserSurname1',
              phone: '+70000000001',
              middlename: '',
              avatar: {},
              birthday: '',
              position: '',
              country: {},
              city: {},
              street: '',
            },
            status: 'confirm',
            isNew: false,
            order: 3,
            proto: {},
            _type: 'user',
            dateCreate: '2024-03-18T12:22:50.502Z',
            dateUpdate: '2024-03-18T12:22:50.502Z',
            isDeleted: false,
          },
        },
      };
      await route.fulfill({ json });
    });

    const loginInput = page.getByTestId('login-input');
    const passwordInput = page.getByTestId('password-input');
    const submitBtn = page.getByTestId('auth-submit-btn');

    await loginInput.fill('test_1');
    await passwordInput.fill('123456');
    await submitBtn.click();

    await page.waitForURL('**/');
    await expect(page).toHaveURL('/');
  });
});
