import { knowledgeBase, offTopicMessage } from "@/data/chat-knowledge";

function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
}

export function getChatResponse(input: string): string {
    const tokens = tokenize(input);
    if (tokens.length === 0) {
        return offTopicMessage;
    }

    let bestScore = 0;
    let bestAnswer = offTopicMessage;

    for (const entry of knowledgeBase) {
        let score = 0;
        for (const keyword of entry.keywords) {
            const kw = keyword.toLowerCase();
            if (input.toLowerCase().includes(kw)) {
                score += kw.split(" ").length + 2;
            }
            for (const token of tokens) {
                if (kw.includes(token) || token.includes(kw)) {
                    score += 1;
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
