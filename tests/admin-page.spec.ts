import { test, expect } from "@playwright/test";

test.describe("Admin panel", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="text"]').fill("test_1");
    await page.locator('input[type="password"]').fill("123456");
    await page.waitForTimeout(600);
    await page.getByRole("button", { name: "Войти" }).click();
    await page.getByRole("link", { name: "Admin" }).click();
  });

  test("should be visible statistic", async ({ page }) => {
    await expect(
      page.getByLabel("usergroup-add").locator("path")
    ).toBeVisible();
  });

  test("should check user table", async({page}) => {
      await page.getByLabel("user", { exact: true }).click();
      await expect(page.getByRole("button", { name: "filter" })).toBeVisible();
      await page.getByRole("button", { name: "filter" }).click();
      await page
        .getByRole("menuitem", { name: "Confirm" })
        .getByLabel("")
        .check();
      await page.getByRole("button", { name: "OK" }).click();
      await expect(page.locator("tbody")).toContainText("test@example.com");
      await page.getByLabel("Username").locator("div").click();
      await expect(page.locator("tbody")).toContainText("test");
      await page.getByRole("button", { name: "filter" }).click();
      await page.getByRole("button", { name: "Reset" }).click();
      await page.getByRole("button", { name: "OK" }).click();
      await page.getByText("Date Create").click();
      await expect(page.locator("tbody")).toContainText(
        "Fri, 12 Apr 2024 10:29:06 GMT"
      );
  })
});
