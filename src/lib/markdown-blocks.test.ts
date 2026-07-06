import { describe, expect, it } from "vitest";
import { parseMarkdownBlocks } from "./markdown-blocks";

describe("parseMarkdownBlocks", () => {
    it("extracts a single fenced code block with its language", () => {
        const source = ["Intro text.", "", "```ts", "const a = 1;", "const b = 2;", "```", "", "Outro text."].join(
            "\n"
        );

        const blocks = parseMarkdownBlocks(source);

        expect(blocks).toEqual([
            { type: "p", text: "Intro text." },
            { type: "code", lang: "ts", code: "const a = 1;\nconst b = 2;" },
            { type: "p", text: "Outro text." },
        ]);
    });

    it("never leaks raw backtick fence markers as plain text", () => {
        const source = ["Before.", "", "```css", ".a { color: red; }", "```", "", "After."].join("\n");

        const blocks = parseMarkdownBlocks(source);
        const rendered = blocks.map((b) => ("text" in b ? b.text : "")).join("");

        expect(rendered).not.toContain("```");
    });

    it("handles multiple fenced code blocks in the same document", () => {
        const source = [
            "One.",
            "",
            "```ts",
            "const a = 1;",
            "```",
            "",
            "Two.",
            "",
            "```css",
            ".a {}",
            "```",
            "",
            "Three.",
        ].join("\n");

        const blocks = parseMarkdownBlocks(source);
        const codeBlocks = blocks.filter((b) => b.type === "code");

        expect(codeBlocks).toHaveLength(2);
        expect(codeBlocks[0]).toMatchObject({ lang: "ts" });
        expect(codeBlocks[1]).toMatchObject({ lang: "css" });
    });

    it("parses headings and bullet lists around code blocks", () => {
        const source = ["## Heading", "", "- one", "- two", "", "```ts", "x();", "```"].join("\n");

        const blocks = parseMarkdownBlocks(source);

        expect(blocks[0]).toEqual({ type: "h2", text: "Heading" });
        expect(blocks[1]).toEqual({ type: "ul", items: ["one", "two"] });
        expect(blocks[2]).toMatchObject({ type: "code", lang: "ts" });
    });

    it("returns an empty array for empty input", () => {
        expect(parseMarkdownBlocks("")).toEqual([]);
    });
});
