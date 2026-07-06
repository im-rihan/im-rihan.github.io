export type CodeTokenKind = "keyword" | "string" | "comment" | "fn" | "prop" | "num" | "punct" | "text";

export interface CodeToken {
    text: string;
    kind: CodeTokenKind;
}

const JS_KEYWORDS = [
    "const", "let", "var", "function", "return", "if", "else", "for", "while", "new",
    "import", "export", "from", "default", "async", "await", "class", "extends",
    "interface", "type", "enum", "public", "private", "readonly", "this", "true",
    "false", "null", "undefined", "typeof", "as", "in", "of", "void", "try", "catch",
    "throw", "continue", "break", "switch", "case", "static", "get", "set",
];

const CSS_KEYWORDS = [
    "important", "inherit", "initial", "unset", "none", "auto", "solid", "flex",
    "grid", "block", "absolute", "relative", "fixed", "sticky",
];

const JS_KEYWORD_PATTERN = `\\b(?:${JS_KEYWORDS.join("|")})\\b`;
const CSS_KEYWORD_PATTERN = `\\b(?:${CSS_KEYWORDS.join("|")})\\b`;

/**
 * Small regex-based tokenizer covering the handful of languages used in blog
 * posts (ts/js, css). Not a real parser — good enough for readable syntax
 * coloring on a personal blog without pulling in a highlighter dependency.
 * Falls back to plain text for anything it doesn't recognize.
 */
export function tokenizeCode(code: string, lang: string): CodeToken[] {
    const language = lang.toLowerCase();
    if (["ts", "tsx", "js", "jsx", "typescript", "javascript"].includes(language)) {
        return tokenizeJsLike(code);
    }
    if (["css", "scss"].includes(language)) {
        return tokenizeCss(code);
    }
    return [{ text: code, kind: "text" }];
}

function tokenizeJsLike(code: string): CodeToken[] {
    const pattern = new RegExp(
        `(//.*$)|("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|\`(?:[^\`\\\\]|\\\\.)*\`)|(\\b\\d+(?:\\.\\d+)?\\b)|(${JS_KEYWORD_PATTERN})|([a-zA-Z_$][\\w$]*)(?=\\s*\\()|([{}()[\\];:,.<>=+\\-*/!&|?])`,
        "gm"
    );

    const tokens: CodeToken[] = [];
    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(code)) !== null) {
        if (match.index > last) tokens.push({ text: code.slice(last, match.index), kind: "text" });
        const [full, comment, str, num, kw, fn, punct] = match;
        if (comment) tokens.push({ text: comment, kind: "comment" });
        else if (str) tokens.push({ text: str, kind: "string" });
        else if (num) tokens.push({ text: num, kind: "num" });
        else if (kw) tokens.push({ text: kw, kind: "keyword" });
        else if (fn) tokens.push({ text: fn, kind: "fn" });
        else if (punct) tokens.push({ text: punct, kind: "punct" });
        last = match.index + full.length;
    }
    if (last < code.length) tokens.push({ text: code.slice(last), kind: "text" });
    return tokens;
}

function tokenizeCss(code: string): CodeToken[] {
    const pattern = new RegExp(
        `(/\\*[\\s\\S]*?\\*/)|("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')|(\\b\\d+(?:\\.\\d+)?(?:px|rem|em|%|vh|vw|s|ms)?\\b)|([.#][\\w-]+)|([a-zA-Z-]+)(?=\\s*:)|(${CSS_KEYWORD_PATTERN})|([{}();:,])`,
        "g"
    );

    const tokens: CodeToken[] = [];
    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(code)) !== null) {
        if (match.index > last) tokens.push({ text: code.slice(last, match.index), kind: "text" });
        const [full, comment, str, num, selector, prop, kw, punct] = match;
        if (comment) tokens.push({ text: comment, kind: "comment" });
        else if (str) tokens.push({ text: str, kind: "string" });
        else if (num) tokens.push({ text: num, kind: "num" });
        else if (selector) tokens.push({ text: selector, kind: "fn" });
        else if (prop) tokens.push({ text: prop, kind: "prop" });
        else if (kw) tokens.push({ text: kw, kind: "keyword" });
        else if (punct) tokens.push({ text: punct, kind: "punct" });
        last = match.index + full.length;
    }
    if (last < code.length) tokens.push({ text: code.slice(last), kind: "text" });
    return tokens;
}
