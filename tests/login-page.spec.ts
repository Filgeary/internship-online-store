import { test, expect } from "@playwright/test";

test.describe("Login page", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("should display error with invalid data", async({page}) => {
    await page.locator('input[type="text"]').fill("test_1");
    await page.locator('input[type="password"]').fill("1234");
    await page.waitForTimeout(600);
    await page.getByRole("button", { name: "Войти" }).click();

    await expect(page.getByText("Wrong login or password")).toBeVisible();
  });

  test("should login", async ({ page }) => {
    await page.locator('input[type="text"]').focus();
    await page.locator('input[type="text"]').fill("test_1");
    await page.locator('input[type="password"]').focus();
    await page.locator('input[type="password"]').fill("123456");
    await page.waitForTimeout(600);
    await page.getByRole("button", { name: "Войти" }).click();

    await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();
  });
});
