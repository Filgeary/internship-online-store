import { test, expect } from "@playwright/test";

test.describe("Catalog Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  test("should allow me to filter catalog", async ({ page }) => {
    await page
      .getByRole("combobox")
      .nth(1)
      .selectOption("65f8322bf3360f03347a6bd6");
    await page
      .locator("div")
      .filter({ hasText: /^По порядкуПо именованиюСначала дорогиеДревние$/ })
      .getByRole("combobox")
      .selectOption("-price");
    await page.getByRole("img").click();
    await page.getByPlaceholder("Поиск").nth(1).focus();
    await page.getByPlaceholder("Поиск").nth(1).fill("ира");
    await page.getByText("IQИрак").click();
    await expect(page.locator(".List")).toContainText(
      "Article №34693 707,51 ₽Добавить"
    );
    await page.goto(
      "/?sort=-price&category=65f8322bf3360f03347a6bd6&madeIn=65f8321bf3360f03347a60bd"
    );
    await expect(
      page.locator("div").filter({ hasText: /^Товар #346$/ })
    ).toBeVisible();
  });

  test("should allow me directory search", async ({ page }) => {
    await page.getByRole("textbox", { name: "Поиск" }).first().focus();
    await page.getByRole("textbox", { name: "Поиск" }).first().fill("бул");
    await expect(page.getByRole("link", { name: "Булка хлеба" })).toBeVisible();
  });

  test("should change pagination", async({page}) => {
    await page.getByRole("link", { name: "3" }).click();
    await expect(page.locator(".Item-price").first()).toContainText("45 087,27 ₽");
  });

  test("should allow to add product to basket", async({page}) => {
    await page
      .locator("div")
      .filter({ hasText: /^405,83 ₽Добавить$/ })
      .getByRole("button")
      .click();
    await page
      .getByLabel("Введите количество товара, которое Вы бы хотели купить")
      .focus();
    await page
      .getByLabel("Введите количество товара, которое Вы бы хотели купить")
      .fill("05");
    await page.getByRole("button", { name: "OK" }).click();
    await expect(page.locator(".BasketTool-total")).toContainText("1 товар / 2 029,15 ₽");
  })

  test("should navigate pages", async({page}) => {
    await page.getByRole("link", { name: "Холст" }).click();
    await expect(page.getByRole("heading", { name: "Холст" })).toBeVisible();
    await page.getByRole("button", { name: "Вход" }).click();
    await expect(page.locator("h2")).toContainText("Вход");
  });

  test("should change language", async({page}) => {
    await page.getByText("ru", { exact: true }).click();
    await page.getByTitle("English").locator("div").click();
    await expect(page.getByRole("heading")).toContainText("Shop");
    await expect(
      page.getByRole("link", { name: "Web Workers" })
    ).toBeVisible();
  });

  test("should add products from basket", async ({page}) => {
    await page.goto("http://localhost:8010/");
    await page.getByRole("button", { name: "Перейти" }).click();
    await expect(page.locator("#root")).toContainText("Корзина");
    await page.getByRole("button", { name: "Выбрать еще товар" }).click();
    await page.getByText("Bread405,83 ₽", { exact: true }).click();
    await page.getByText("Pencils739,86 ₽", { exact: true }).click();
    await page.getByText("Mouse929,27 ₽", { exact: true }).click();
    await page
      .getByRole("button", { name: "Добавить выбранные товары" })
      .click();
    await expect(page.locator("#root")).toContainText("Карандаши");
    await page.getByRole("button", { name: "Закрыть" }).click();
    await expect(page.locator("#root")).toContainText("3 товара / 2 074,96 ₽");
  })
});
