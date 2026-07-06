import { describe, expect, it } from "vitest";
import { getCountryCoords, hasCountryCoords } from "./country-coordinates";

describe("hasCountryCoords", () => {
    it("returns true for a known country code", () => {
        expect(hasCountryCoords("IN")).toBe(true);
        expect(hasCountryCoords("in")).toBe(true);
    });

    it("returns false for the Unknown sentinel code", () => {
        expect(hasCountryCoords("XX")).toBe(false);
    });

    it("returns false for a code with no coordinates", () => {
        expect(hasCountryCoords("ZZ")).toBe(false);
    });
});

describe("getCountryCoords", () => {
    it("returns [lon, lat] for a known code, case-insensitively", () => {
        expect(getCountryCoords("IN")).toEqual([78, 22]);
        expect(getCountryCoords("in")).toEqual([78, 22]);
    });

    it("falls back to the XX sentinel coordinates for unknown codes", () => {
        expect(getCountryCoords("ZZ")).toEqual(getCountryCoords("XX"));
    });
});
