"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { tokenizeCode } from "@/lib/code-highlight";
import styles from "./CodeBlock.module.css";

const KIND_CLASS: Record<string, string> = {
    keyword: styles.kw,
    string: styles.str,
    comment: styles.comment,
    fn: styles.fn,
    prop: styles.prop,
    num: styles.num,
    punct: styles.punct,
};

export function CodeBlock({ lang, code }: { lang: string; code: string }) {
    const [copied, setCopied] = useState(false);
    const tokens = tokenizeCode(code, lang);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            // Clipboard API unavailable (e.g. insecure context) — fail silently.
        }
    }

    return (
        <div className={styles.window}>
            <div className={styles.header}>
                <span className={styles.dot} data-tone="red" aria-hidden />
                <span className={styles.dot} data-tone="yellow" aria-hidden />
                <span className={styles.dot} data-tone="green" aria-hidden />
                {lang && <span className={styles.lang}>{lang}</span>}
                <button type="button" className={styles.copyBtn} onClick={handleCopy} aria-label="Copy code to clipboard">
                    {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <pre className={styles.pre}>
                <code>
                    {tokens.map((token, i) => {
                        const cls = KIND_CLASS[token.kind];
                        return cls ? (
                            <span key={i} className={cls}>
                                {token.text}
                            </span>
                        ) : (
                            <span key={i}>{token.text}</span>
                        );
                    })}
                </code>
            </pre>
        </div>
    );
}
