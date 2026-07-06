import type { ReactNode } from "react";
import styles from "./BlogMarkdown.module.css";

type Block =
    | { type: "h2" | "h3"; text: string }
    | { type: "p"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "code"; lang: string; code: string };

function parseBlocks(source: string): Block[] {
    const blocks: Block[] = [];
    const parts = source.split(/\n```/);
    let textSegment = parts[0] ?? "";

    for (let i = 1; i < parts.length; i++) {
        const chunk = parts[i];
        const fenceEnd = chunk.indexOf("```");
        if (fenceEnd === -1) {
            textSegment += `\n\`\`\`${chunk}`;
            continue;
        }
        const header = chunk.slice(0, fenceEnd);
        const rest = chunk.slice(fenceEnd + 3);
        const nl = header.indexOf("\n");
        const lang = nl === -1 ? header.trim() : header.slice(0, nl).trim();
        const code = nl === -1 ? "" : header.slice(nl + 1);
        pushTextBlocks(textSegment, blocks);
        blocks.push({ type: "code", lang, code });
        textSegment = rest.replace(/^\n/, "");
    }

    pushTextBlocks(textSegment, blocks);
    return blocks;
}

function pushTextBlocks(text: string, blocks: Block[]) {
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

function renderInline(text: string, keyPrefix: string): ReactNode[] {
    const nodes: ReactNode[] = [];
    const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    let last = 0;
    let match: RegExpExecArray | null;
    let idx = 0;

    while ((match = pattern.exec(text)) !== null) {
        if (match.index > last) {
            nodes.push(text.slice(last, match.index));
        }
        const token = match[0];
        if (token.startsWith("**")) {
            nodes.push(<strong key={`${keyPrefix}-b-${idx++}`}>{token.slice(2, -2)}</strong>);
        } else if (token.startsWith("*")) {
            nodes.push(<em key={`${keyPrefix}-i-${idx++}`}>{token.slice(1, -1)}</em>);
        } else if (token.startsWith("`")) {
            nodes.push(
                <code key={`${keyPrefix}-c-${idx++}`} className={styles.inlineCode}>
                    {token.slice(1, -1)}
                </code>
            );
        } else if (token.startsWith("[")) {
            const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
            if (m) {
                const isExternal = m[2].startsWith("http");
                nodes.push(
                    <a
                        key={`${keyPrefix}-a-${idx++}`}
                        href={m[2]}
                        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                        {m[1]}
                    </a>
                );
            } else {
                nodes.push(token);
            }
        }
        last = match.index + token.length;
    }

    if (last < text.length) {
        nodes.push(text.slice(last));
    }

    return nodes.length ? nodes : [text];
}

export function BlogMarkdown({ source }: { source: string }) {
    const blocks = parseBlocks(source.trim());

    return (
        <div className={styles.markdown}>
            {blocks.map((block, i) => {
                if (block.type === "h2") return <h2 key={i}>{renderInline(block.text, `h2-${i}`)}</h2>;
                if (block.type === "h3") return <h3 key={i}>{renderInline(block.text, `h3-${i}`)}</h3>;
                if (block.type === "ul") {
                    return (
                        <ul key={i}>
                            {block.items.map((item, j) => (
                                <li key={j}>{renderInline(item, `ul-${i}-${j}`)}</li>
                            ))}
                        </ul>
                    );
                }
                if (block.type === "code") {
                    return (
                        <pre key={i} className={styles.codeBlock}>
                            <code>{block.code.trimEnd()}</code>
                        </pre>
                    );
                }
                return (
                    <p key={i}>
                        {block.text.split("\n").map((line, j, arr) => (
                            <span key={j}>
                                {renderInline(line, `p-${i}-${j}`)}
                                {j < arr.length - 1 ? <br /> : null}
                            </span>
                        ))}
                    </p>
                );
            })}
        </div>
    );
}
