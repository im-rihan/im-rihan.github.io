import { describe, expect, it } from "vitest";
import { inferUnresolvedVisits, visitGeoWasInferred } from "./geo-inference";
import type { VisitRecord } from "./visitor-analytics";

function visit(
    partial: Partial<VisitRecord> & Pick<VisitRecord, "id" | "countryCode">,
): VisitRecord {
    return {
        countryName: partial.countryName ?? "Unknown",
        city: partial.city ?? "",
        region: partial.region ?? "",
        deviceType: partial.deviceType ?? "desktop",
        deviceLabel: partial.deviceLabel ?? "Desktop · Windows",
        browser: partial.browser ?? "Chrome",
        os: partial.os ?? "Windows",
        page: partial.page ?? "/",
        timestamp: partial.timestamp ?? "2026-07-07T12:00:00.000Z",
        ...partial,
    };
}

describe("inferUnresolvedVisits", () => {
    it("copies geo from a resolved visit with the same device fingerprint", () => {
        const visits: VisitRecord[] = [
            visit({
                id: "xx-1",
                countryCode: "XX",
                timestamp: "2026-07-07T15:00:00.000Z",
            }),
            visit({
                id: "in-1",
                countryCode: "IN",
                countryName: "India",
                city: "Nayagarh",
                region: "Odisha",
                timestamp: "2026-07-02T14:42:12.508Z",
            }),
        ];

        const enriched = inferUnresolvedVisits(visits);
        expect(enriched[0].countryCode).toBe("IN");
        expect(enriched[0].city).toBe("Nayagarh");
        expect(visitGeoWasInferred(visits[0], enriched[0])).toBe(true);
    });

    it("uses current geo when no sibling exists", () => {
        const visits: VisitRecord[] = [
            visit({ id: "xx-1", countryCode: "XX", browser: "Edge" }),
        ];

        const enriched = inferUnresolvedVisits(visits, {
            currentGeo: {
                countryCode: "IN",
                countryName: "India",
                city: "Puri",
                region: "Odisha",
            },
            currentDevice: { browser: "Edge", os: "Windows", deviceType: "desktop" },
        });

        expect(enriched[0].countryCode).toBe("IN");
        expect(enriched[0].city).toBe("Puri");
    });

    it("does not cross-match different browsers", () => {
        const visits: VisitRecord[] = [
            visit({ id: "xx-1", countryCode: "XX", browser: "Edge" }),
            visit({
                id: "in-1",
                countryCode: "IN",
                countryName: "India",
                browser: "Chrome",
            }),
        ];

        const enriched = inferUnresolvedVisits(visits);
        expect(enriched[0].countryCode).toBe("XX");
    });
});
