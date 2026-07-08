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
