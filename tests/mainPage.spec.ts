import { test , expect } from '@playwright/test';


test.beforeEach(async ({page}) => {
  await page.goto("http://localhost:3000/");
})

test("page title", async ({ page }) => {
  await expect(page).toHaveTitle("Simple SPA")
})

test("page header", async ({page}) => {
  await expect(page.getByRole("heading", {name: "Магазин"})).toBeVisible()

  await page.locator('div').filter({ hasText: /^РусскийEnglish$/ }).getByRole('combobox').selectOption('en');
  //await page.getByRole('combobox', { name: /^РусскийEnglish$/ }).selectOption('en');

  await expect(page.getByRole("heading", {name: "Shop"})).toBeVisible();
})

test('login test', async ({ page }) => {
  await page.getByRole('button', { name: 'Вход' }).click();

  await page.locator('input[type="text"]').fill("test_1");
  await page.locator('input[type="password"]').fill("123456");

  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Войти' }).click();
  await page.getByRole('link', { name: 'User №1' }).click();
  expect(page.getByRole('heading', { name: 'Профиль' })).toBeVisible();
});

test("add to cart", async ({page}) => {

  await page.goto('http://localhost:3000/');
  await page.locator('div').filter({ hasText: /^405,83 Добавить$/ }).getByRole('button').click();
  await page.getByRole('button', { name: 'Ок' }).click();

  expect(page.getByText('товар / 405,83 ₽')).toBeDefined();
})

