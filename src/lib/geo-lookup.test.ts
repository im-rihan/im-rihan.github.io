import { describe, expect, it } from "vitest";
import { isUnknownCountryCode, normalizeGeoResult } from "./geo-lookup";

describe("normalizeGeoResult", () => {
    it("accepts valid ISO country codes", () => {
        expect(normalizeGeoResult("in", "India", "Puri", "Odisha")).toEqual({
            countryCode: "IN",
            countryName: "India",
            city: "Puri",
            region: "Odisha",
        });
    });

    it("rejects unknown and invalid codes", () => {
        expect(normalizeGeoResult("XX", "Unknown")).toBeNull();
        expect(normalizeGeoResult("", "Unknown")).toBeNull();
        expect(normalizeGeoResult("T1", "Tor")).toBeNull();
    });

    it("falls back to countryNames when name is missing", () => {
        expect(normalizeGeoResult("IN", undefined)?.countryName).toBe("India");
    });
});

describe("isUnknownCountryCode", () => {
    it("flags XX and empty codes", () => {
        expect(isUnknownCountryCode("XX")).toBe(true);
        expect(isUnknownCountryCode("IN")).toBe(false);
    });
});
