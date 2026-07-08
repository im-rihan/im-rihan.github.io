import { describe, expect, it } from "vitest";
import { getChatResponse } from "./chat-engine";
import { offTopicMessage } from "@/data/chat-knowledge";

describe("getChatResponse", () => {
    it("returns the off-topic message for empty input", () => {
        expect(getChatResponse("")).toBe(offTopicMessage);
        expect(getChatResponse("   ")).toBe(offTopicMessage);
    });

    it("returns the off-topic message for unrelated gibberish", () => {
        expect(getChatResponse("xyzzy qwerty asdf")).toBe(offTopicMessage);
    });

    it("matches a single-word keyword", () => {
        const answer = getChatResponse("Tell me about Ziffy");
        expect(answer).not.toBe(offTopicMessage);
        expect(answer).toContain("Ziffy.ai");
    });

    it("matches a multi-word phrase keyword", () => {
        const answer = getChatResponse("who are you?");
        expect(answer).toContain("portfolio assistant");
    });

    it("is case-insensitive", () => {
        const lower = getChatResponse("what is his tech stack");
        const upper = getChatResponse("WHAT IS HIS TECH STACK");
        expect(lower).toBe(upper);
        expect(lower).not.toBe(offTopicMessage);
    });

    it("handles simple plural/tense variation via fuzzy prefix match", () => {
        const answer = getChatResponse("certifications please");
        expect(answer).not.toBe(offTopicMessage);
        expect(answer).toContain("15 certifications");
    });

    it("does not let a single short token inflate unrelated scores", () => {
        // "a" and other 1-char tokens are stripped, so this should stay off-topic
        // rather than weakly matching many entries.
        const answer = getChatResponse("a e i o u");
        expect(answer).toBe(offTopicMessage);
    });

    it("picks the highest-scoring entry when multiple keywords could match", () => {
        const answer = getChatResponse("how many years of experience does he have");
        expect(answer).toContain("4+ years");
    });

    it("matches paraphrased questions via synonym expansion", () => {
        const answer = getChatResponse("what technologies does he use?");
        expect(answer).not.toBe(offTopicMessage);
        expect(answer.toLowerCase()).toMatch(/react|next|typescript|nestjs/);
    });
});
