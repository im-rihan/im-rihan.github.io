import { describe, expect, it } from "vitest";
import { aggregateByField, formatVisitTime, topCountryShare } from "./analytics-insights";
import type { CountryStat, VisitRecord } from "@/lib/visitor-analytics";

function makeVisit(overrides: Partial<VisitRecord>): VisitRecord {
    return {
        id: "1",
        countryCode: "IN",
        countryName: "India",
        city: "",
        region: "",
        deviceType: "desktop",
        deviceLabel: "Desktop · Windows",
        browser: "Chrome",
        os: "Windows",
        page: "/",
        timestamp: new Date().toISOString(),
        ...overrides,
    };
}

describe("topCountryShare", () => {
    it("returns 0 when there is no data", () => {
        expect(topCountryShare([], 0)).toBe(0);
        expect(topCountryShare([], 10)).toBe(0);
    });

    it("computes the top country's percentage share, rounded", () => {
        const countries: CountryStat[] = [
            { code: "IN", name: "India", count: 30 },
            { code: "US", name: "United States", count: 10 },
        ];
        expect(topCountryShare(countries, 40)).toBe(75);
    });
});

describe("aggregateByField", () => {
    it("counts and sorts by frequency descending", () => {
        const visits = [
            makeVisit({ browser: "Chrome" }),
            makeVisit({ browser: "Chrome" }),
            makeVisit({ browser: "Safari" }),
        ];
        expect(aggregateByField(visits, "browser")).toEqual([
            { label: "Chrome", count: 2 },
            { label: "Safari", count: 1 },
        ]);
    });

    it("falls back to Unknown for empty field values", () => {
        const visits = [makeVisit({ browser: "" })];
        expect(aggregateByField(visits, "browser")).toEqual([{ label: "Unknown", count: 1 }]);
    });

    it("returns an empty array for no visits", () => {
        expect(aggregateByField([], "page")).toEqual([]);
    });
});

describe("formatVisitTime", () => {
    it("formats sub-minute timestamps as Just now", () => {
        expect(formatVisitTime(new Date().toISOString())).toBe("Just now");
    });

    it("formats minutes ago", () => {
        const iso = new Date(Date.now() - 5 * 60_000).toISOString();
        expect(formatVisitTime(iso)).toBe("5m ago");
    });

    it("formats hours ago", () => {
        const iso = new Date(Date.now() - 3 * 3_600_000).toISOString();
        expect(formatVisitTime(iso)).toBe("3h ago");
    });

    it("formats days ago", () => {
        const iso = new Date(Date.now() - 2 * 86_400_000).toISOString();
        expect(formatVisitTime(iso)).toBe("2d ago");
    });
});
