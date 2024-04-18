import { test, expect } from "@playwright/test";

test.describe("Login page", async () => {
  test("should login", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="text"]').focus();
    await page.locator('input[type="text"]').fill("test_1");
    await page.locator('input[type="password"]').focus();
    await page.locator('input[type="password"]').fill("123456");

    await page.getByRole("button", { name: "Войти" }).click();

  });
});
