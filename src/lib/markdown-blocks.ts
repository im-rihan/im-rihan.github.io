export type MarkdownBlock =
    | { type: "h2" | "h3"; text: string }
    | { type: "p"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "code"; lang: string; code: string };

/**
 * Parses a small Markdown subset (headings, paragraphs, bullet lists, fenced
 * code blocks) used by blog post content into renderable blocks.
 */
export function parseMarkdownBlocks(source: string): MarkdownBlock[] {
    const blocks: MarkdownBlock[] = [];
    // Fenced code blocks are delimited by a "\n```" on either side, so
    // splitting on that pattern yields text/code/text/code/... in strict
    // alternation: even indices are prose, odd indices are inside a fence
    // (with the language on the fence's first line).
    const parts = source.split(/\n```/);

    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) {
            const chunk = parts[i];
            const nl = chunk.indexOf("\n");
            const lang = nl === -1 ? chunk.trim() : chunk.slice(0, nl).trim();
            const code = nl === -1 ? "" : chunk.slice(nl + 1);
            blocks.push({ type: "code", lang, code });
        } else {
            pushTextBlocks(parts[i], blocks);
        }
    }

    return blocks;
}

function pushTextBlocks(text: string, blocks: MarkdownBlock[]) {
    const paragraphs = text
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);

    for (const p of paragraphs) {
        if (p.startsWith("### ")) {
            blocks.push({ type: "h3", text: p.slice(4).trim() });
            continue;
        }
        if (p.startsWith("## ")) {
            blocks.push({ type: "h2", text: p.slice(3).trim() });
            continue;
        }
        const lines = p.split("\n");
        if (lines.every((l) => /^[-*•]\s+/.test(l.trim()))) {
            blocks.push({
                type: "ul",
                items: lines.map((l) => l.trim().replace(/^[-*•]\s+/, "")),
            });
        } else {
            blocks.push({ type: "p", text: p });
        }
    }
}
