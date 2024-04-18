import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/draw');
  await page.getByLabel('draw line').click();
  await page.locator('canvas').click({
    button: "left",
    position: {
      x: 444,
      y: 251
    }
  });
});
