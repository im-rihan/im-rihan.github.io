import { knowledgeBase, offTopicMessage } from "@/data/chat-knowledge";

const MIN_TOKEN_LENGTH = 2;
const MIN_FUZZY_LENGTH = 3;

/** Lightweight paraphrase hints — expands query tokens before keyword scoring. */
const QUERY_SYNONYMS: Record<string, string[]> = {
    stack: ["tech", "technologies", "skills", "tools", "frameworks"],
    experience: ["background", "years", "career", "work", "history"],
    contact: ["email", "reach", "hire", "message", "phone"],
    projects: ["work", "built", "portfolio", "case", "studies"],
    resume: ["cv", "download", "pdf"],
    certifications: ["certs", "credentials", "certificates"],
    nestjs: ["nestjs", "nest", "api"],
    aws: ["cloud", "lambda", "devops", "s3"],
    python: ["django", "scraping", "pipelines"],
    php: ["webhooks", "laravel"],
    ziffy: ["property", "real", "estate", "search"],
    open: ["available", "hiring", "roles", "job"],
};

function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((token) => token.length >= MIN_TOKEN_LENGTH);
}

function expandTokens(tokens: Set<string>): Set<string> {
    const expanded = new Set(tokens);
    for (const token of tokens) {
        const syns = QUERY_SYNONYMS[token];
        if (syns) syns.forEach((s) => expanded.add(s));
        for (const [key, values] of Object.entries(QUERY_SYNONYMS)) {
            if (values.includes(token)) {
                expanded.add(key);
                values.forEach((s) => expanded.add(s));
            }
        }
    }
    return expanded;
}

function bigrams(text: string): Set<string> {
    const grams = new Set<string>();
    const compact = text.replace(/\s+/g, "");
    for (let i = 0; i < compact.length - 1; i++) {
        grams.add(compact.slice(i, i + 2));
    }
    return grams;
}

/** Sørensen–Dice coefficient on character bigrams (0–1). */
function diceSimilarity(a: string, b: string): number {
    if (a === b) return 1;
    if (a.length < 2 || b.length < 2) return 0;
    const aGrams = bigrams(a);
    const bGrams = bigrams(b);
    let overlap = 0;
    for (const g of aGrams) {
        if (bGrams.has(g)) overlap++;
    }
    return (2 * overlap) / (aGrams.size + bGrams.size);
}

export function getChatResponse(input: string): string {
    const normalized = input.toLowerCase();
    const tokens = expandTokens(new Set(tokenize(input)));
    if (tokens.size === 0) {
        return offTopicMessage;
    }

    let bestScore = 0;
    let bestAnswer = offTopicMessage;

    for (const entry of knowledgeBase) {
        let score = 0;
        for (const keyword of entry.keywords) {
            const kw = keyword.toLowerCase();

            if (kw.includes(" ")) {
                if (normalized.includes(kw)) {
                    score += kw.split(" ").length + 2;
                }
                continue;
            }

            if (tokens.has(kw)) {
                score += 3;
                continue;
            }

            if (kw.length < MIN_FUZZY_LENGTH) continue;

            for (const token of tokens) {
                if (token.length < MIN_FUZZY_LENGTH) continue;
                if (token.startsWith(kw) || kw.startsWith(token)) {
                    score += 2;
                    break;
                }
                const sim = diceSimilarity(token, kw);
                if (sim >= 0.55) {
                    score += 1 + Math.round(sim);
                    break;
                }
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestAnswer = entry.answer;
        }
    }

    if (bestScore < 2) {
        return offTopicMessage;
    }

    return bestAnswer;
}
