import { expect, test } from '@playwright/test';

test.describe('Catalog', () => {
  test('Filter, search & products ordering', async ({ page }) => {
    await page.goto('/');

    await test.step('catalog filter and search', async () => {
      await page.getByRole('button', { name: 'Все' }).first().click();
      await page.getByRole('option', { name: 'US United States' }).click();
      await page.getByRole('option', { name: 'AE United Arab Emirates' }).click();
      await page.getByRole('option', { name: 'RU Russian Federation' }).click();
      await page.getByRole('combobox').nth(1).selectOption('65f8322bf3360f03347a6bdc');
      await page.getByTestId('input-search').click();
      await page.getByPlaceholder('Поиск').fill('7');
      // use timeout, if you have debounced input
      // but its better to disable all debounce/throttle with NODE_ENV.TEST
      // otherwise use code below
      // await page.waitForTimeout(500);
    });

    await test.step('select article', async () => {
      await page.getByRole('link', { name: /article №507/i }).click();
      await expect(page.getByRole('heading', { name: 'Article №' })).toBeVisible();
    });

    await test.step('add to basket', async () => {
      await page.getByRole('button', { name: 'Добавить' }).click();
      await page.getByRole('spinbutton').click();
      await page.getByRole('spinbutton').fill('3');
      await page.getByRole('button', { name: 'Подтвердить' }).click();
      (await page.getByTestId('basket-tool-total').textContent()) === '1 товар / 278 906,64 ₽';
    });

    await test.step('continue ordering', async () => {
      await page.getByRole('button', { name: 'Перейти' }).click();
      await page.getByRole('button', { name: 'Выбрать ещё товар' }).click();
      await page.locator('.ItemModalCatalog-actions > button').first().click();
      await page.getByRole('spinbutton').click();
      await page.getByRole('spinbutton').fill('2');
      await page.getByRole('button', { name: 'Подтвердить' }).click();
      await page.locator('#selectedItem65f8322cf3360f03347a6be3').check();
      await page.locator('#selectedItem65f8322cf3360f03347a6be4').check();
      await page.locator('#selectedItem65f8322cf3360f03347a6be5').check();
      await page.getByRole('button', { name: 'Добавить товары' }).click();
      await page
        .locator('div')
        .filter({ hasText: /^739,86 ₽1 штУдалить$/ })
        .getByRole('button')
        .click();
    });

    await test.step('basket total amount', async () => {
      (await page.getByTestId('basket-total').textContent()) === '280 920,6 ₽';
    });
  });
});
