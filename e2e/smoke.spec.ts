import { test, expect } from "@playwright/test";

test.describe("portfolio smoke", () => {
    test("home page loads with main content", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator("#main-content")).toBeVisible();
        await expect(page.getByRole("heading", { name: /Full Stack Developer/i })).toBeVisible();
    });

    test("work index lists case studies", async ({ page }) => {
        await page.goto("/work/");
        await expect(page.locator("#main-content")).toBeVisible();
        await expect(page.getByRole("link", { name: /Ziffy/i }).first()).toBeVisible();
    });

    test("status page renders analytics dashboard", async ({ page }) => {
        await page.goto("/status/");
        await expect(page.getByRole("heading", { name: /Portfolio Stats/i })).toBeVisible();
    });

    test("blog index is reachable", async ({ page }) => {
        await page.goto("/blog/");
        await expect(page.locator("#main-content")).toBeVisible();
    });

    test("skip link targets main content", async ({ page }) => {
        await page.goto("/");
        const skip = page.getByRole("link", { name: /skip to main content/i });
        await expect(skip).toHaveAttribute("href", "#main-content");
    });

    test("home content stays visible after navigating away and back", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator("#about")).toBeVisible();

        await page.goto("/work/");
        await expect(page.locator("#main-content")).toBeVisible();

        await page.goto("/");
        await expect(page.locator("#main-content")).toBeVisible();
        await expect(page.locator("#about")).toBeVisible();
        await expect(page.locator("#about")).toHaveCSS("opacity", "1");
        await expect(page.getByRole("heading", { name: /Hi,/i })).toBeVisible();
    });
});
