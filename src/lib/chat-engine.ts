import { knowledgeBase, offTopicMessage } from "@/data/chat-knowledge";

// Tokens shorter than this (e.g. the stray "s" left over from stripping the
// apostrophe in "What's"/"Rihan's") are dropped — a single letter is a
// substring of almost every keyword, which was inflating unrelated scores.
const MIN_TOKEN_LENGTH = 2;
// Below this length, only exact token matches count — fuzzy prefix matching
// on very short keywords (e.g. "hi", "cv") would match unrelated words too.
const MIN_FUZZY_LENGTH = 3;

function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((token) => token.length >= MIN_TOKEN_LENGTH);
}

export function getChatResponse(input: string): string {
    const normalized = input.toLowerCase();
    const tokens = new Set(tokenize(input));
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
                // Multi-word keyword (e.g. "who are you") — only makes sense
                // matched as a phrase against the raw input, not token-by-token.
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
            // Fuzzy prefix match (handles simple plurals/tense, e.g.
            // "certifications" vs "certification") — deliberately not a
            // mid-word substring check, which was matching unrelated words.
            for (const token of tokens) {
                if (token.length < MIN_FUZZY_LENGTH) continue;
                if (token.startsWith(kw) || kw.startsWith(token)) {
                    score += 2;
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
