import { test, expect } from '@playwright/test';

test('Canvas page', async ({ page }) => {
  await page.goto('/draw');
  await page.getByLabel('draw line').click();
  await page.locator("canvas").click({
    button: "left",
    position: {
      x: 444,
      y: 251,
    },
  });
  await page.locator("canvas").click({
    button: "left",
    position: {
      x: 454,
      y: 261,
    },
  });
  await expect(page).toHaveScreenshot("canvas.png");
});
