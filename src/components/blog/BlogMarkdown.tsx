import type { ReactNode } from "react";
import { parseMarkdownBlocks } from "@/lib/markdown-blocks";
import { CodeBlock } from "./CodeBlock";
import styles from "./BlogMarkdown.module.css";

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
    const blocks = parseMarkdownBlocks(source.trim());

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
                    return <CodeBlock key={i} lang={block.lang} code={block.code.trimEnd()} />;
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
