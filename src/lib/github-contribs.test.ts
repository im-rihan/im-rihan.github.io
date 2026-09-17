import { describe, expect, it, vi, afterEach } from "vitest";
import {
    fetchContributions,
    generateGitHubInsights,
    parseContributionPayload,
} from "@/lib/github-contribs";

describe("parseContributionPayload", () => {
    it("parses jogruber flat last-year payload", () => {
        const data = parseContributionPayload({
            total: { lastYear: 42 },
            contributions: [
                { date: "2025-09-14", count: 0, level: 0 },
                { date: "2025-09-15", count: 3, level: 1 },
                { date: "2025-09-16", count: 8, level: 3 },
                ...Array.from({ length: 30 }, (_, i) => ({
                    date: `2025-10-${String(i + 1).padStart(2, "0")}`,
                    count: i % 4,
                    level: i % 5,
                })),
            ],
        });

        expect(data).not.toBeNull();
        expect(data!.totalContributions).toBe(42);
        expect(data!.weeks.length).toBeGreaterThan(0);
        expect(data!.contributions.some((d) => d.count === 8 && d.level === 3)).toBe(true);
    });

    it("rejects payloads with too few days", () => {
        expect(
            parseContributionPayload({
                contributions: [{ date: "2025-01-01", count: 1, level: 1 }],
            }),
        ).toBeNull();
    });
});

describe("fetchContributions", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("falls back when the first source fails", async () => {
        const good = {
            total: { lastYear: 10 },
            contributions: Array.from({ length: 40 }, (_, i) => {
                const day = (i % 28) + 1;
                return {
                    date: `2025-11-${String(day).padStart(2, "0")}`,
                    count: i % 3,
                    level: i % 4,
                };
            }),
        };

        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({}) })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => good,
            });
        vi.stubGlobal("fetch", fetchMock);

        const data = await fetchContributions("im-rihan");
        expect(data).not.toBeNull();
        expect(data!.totalContributions).toBe(10);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
});

describe("generateGitHubInsights", () => {
    it("includes totals and peak day", () => {
        const days = Array.from({ length: 40 }, (_, i) => ({
            date: `2025-12-${String((i % 28) + 1).padStart(2, "0")}`,
            count: i === 5 ? 20 : 1,
            level: i === 5 ? 4 : 1,
        }));
        const data = parseContributionPayload({ total: { lastYear: 59 }, contributions: days });
        expect(data).not.toBeNull();
        const tips = generateGitHubInsights(data!);
        expect(tips[0]).toMatch(/59 contributions/);
        expect(tips.some((t) => t.includes("Peak day"))).toBe(true);
    });
});
