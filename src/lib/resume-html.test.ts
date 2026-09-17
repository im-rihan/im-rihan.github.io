import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const RESUME_HTML = resolve(process.cwd(), "resume/resume.html");

describe("resume HTML contact icons", () => {
    const html = readFileSync(RESUME_HTML, "utf-8");

    it("uses unified stroke icons in screen CSS", () => {
        expect(html).toMatch(/\.contact-item \.icon svg\s*\{[^}]*width:\s*12px/);
        expect(html).toMatch(/stroke-width:\s*2/);
    });

    it("includes all contact channels with labels", () => {
        expect(html).toContain("contact-label");
        expect(html).toContain("im.rihan.dev@gmail.com");
        expect(html).toContain("linkedin.com/in/im-rihan");
        expect(html).toContain("github.com/im-rihan");
    });

    it("uses the shortened home address in contact section", () => {
        expect(html).toContain("Bhagabanpur, Brahmagiri, Puri 752011");
        expect(html).not.toContain("Bhagabanpur, Panaspada");
    });
});

describe("resume HTML content sync", () => {
    const html = readFileSync(RESUME_HTML, "utf-8");

    it("includes portfolio skill highlights", () => {
        expect(html).toContain("Leaflet");
        expect(html).toContain("FastAPI");
        expect(html).toContain("CatBoost");
        expect(html).toContain("LangGraph");
        expect(html).toContain("MCP");
        expect(html).toContain("DuckDB");
        expect(html).toContain("PHP 8.3");
        expect(html).toContain("Next.js 15");
    });

    it("lists key projects including AVM and realtor platform", () => {
        expect(html).toContain("ha-realtor-plat");
        expect(html).toContain("Rental-Estimate-AVM");
        expect(html).toContain("Ziffy.ai Platform");
        expect(html).toContain("appi — Core API");
    });

    it("includes PGDCA years and updated tenure", () => {
        expect(html).toContain("2020 – 2021");
        expect(html).toContain("1 yr 9 mos");
        expect(html).toContain("4 yrs 6 mos");
    });
});
