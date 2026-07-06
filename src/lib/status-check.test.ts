import { describe, expect, it } from "vitest";
import { computeOverallHealth, sortStatusResults, type StatusResult } from "./status-check";

function makeResult(overrides: Partial<StatusResult>): StatusResult {
    return {
        name: "Test",
        url: "https://example.com",
        status: "online",
        responseMs: 100,
        group: "page",
        checkedAt: Date.now(),
        ...overrides,
    };
}

describe("computeOverallHealth", () => {
    it("returns operational when everything is online", () => {
        const results = [makeResult({ status: "online" }), makeResult({ status: "online" })];
        expect(computeOverallHealth(results)).toBe("operational");
    });

    it("returns degraded when something is slow or unknown", () => {
        expect(computeOverallHealth([makeResult({ status: "slow" })])).toBe("degraded");
        expect(computeOverallHealth([makeResult({ status: "unknown" })])).toBe("degraded");
    });

    it("returns outage when anything is offline, even if others are fine", () => {
        const results = [makeResult({ status: "online" }), makeResult({ status: "offline" })];
        expect(computeOverallHealth(results)).toBe("outage");
    });

    it("prioritizes outage over degraded when both are present", () => {
        const results = [makeResult({ status: "slow" }), makeResult({ status: "offline" })];
        expect(computeOverallHealth(results)).toBe("outage");
    });

    it("treats an empty result set as operational", () => {
        expect(computeOverallHealth([])).toBe("operational");
    });
});

describe("sortStatusResults", () => {
    it("orders offline first, then unknown, then slow, then online", () => {
        const results = [
            makeResult({ name: "online", status: "online" }),
            makeResult({ name: "offline", status: "offline" }),
            makeResult({ name: "slow", status: "slow" }),
            makeResult({ name: "unknown", status: "unknown" }),
        ];
        const sorted = sortStatusResults(results).map((r) => r.name);
        expect(sorted).toEqual(["offline", "unknown", "slow", "online"]);
    });

    it("breaks ties within the same status by descending response time", () => {
        const results = [
            makeResult({ name: "fast", status: "online", responseMs: 50 }),
            makeResult({ name: "slow-ish", status: "online", responseMs: 500 }),
        ];
        const sorted = sortStatusResults(results).map((r) => r.name);
        expect(sorted).toEqual(["slow-ish", "fast"]);
    });

    it("does not mutate the input array", () => {
        const results = [makeResult({ name: "a" }), makeResult({ name: "b" })];
        const copy = [...results];
        sortStatusResults(results);
        expect(results).toEqual(copy);
    });
});
