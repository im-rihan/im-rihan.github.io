/**
 * Unit tests for visitor-analytics.ts
 * These run in a jsdom-like node environment so we stub localStorage/sessionStorage.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

// ── Minimal localStorage / sessionStorage stubs ─────────────────────────────
const makeStorage = () => {
    const store: Record<string, string> = {};
    return {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => { store[k] = v; },
        removeItem: (k: string) => { delete store[k]; },
        clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    };
};

const localStorageMock = makeStorage();
const sessionStorageMock = makeStorage();

vi.stubGlobal("localStorage", localStorageMock);
vi.stubGlobal("sessionStorage", sessionStorageMock);
vi.stubGlobal("window", { location: { hostname: "localhost", search: "" } });

// Import after stubs are in place
import {
    formatVisitGeo,
    UNRESOLVED_COUNTRY_CODE,
    UNRESOLVED_COUNTRY_NAME,
    shouldUseDemoAnalytics,
} from "./visitor-analytics";

beforeEach(() => {
    localStorageMock.clear();
    sessionStorageMock.clear();
    vi.unstubAllEnvs();
});

// ── formatVisitGeo ────────────────────────────────────────────────────────────
describe("formatVisitGeo", () => {
    it("returns city + country for a resolved visit with a city", () => {
        expect(
            formatVisitGeo({ countryCode: "IN", countryName: "India", city: "Puri" }),
        ).toBe("Puri, India");
    });

    it("returns country name when city is empty", () => {
        expect(
            formatVisitGeo({ countryCode: "IN", countryName: "India", city: "" }),
        ).toBe("India");
    });

    it("returns UNRESOLVED_COUNTRY_NAME for XX code", () => {
        expect(
            formatVisitGeo({ countryCode: UNRESOLVED_COUNTRY_CODE, countryName: "Unknown", city: "" }),
        ).toBe(UNRESOLVED_COUNTRY_NAME);
    });
});

// ── shouldUseDemoAnalytics ────────────────────────────────────────────────────
describe("shouldUseDemoAnalytics", () => {
    it("returns true on localhost by default", () => {
        vi.stubGlobal("window", { location: { hostname: "localhost", search: "" } });
        expect(shouldUseDemoAnalytics()).toBe(true);
    });

    it("returns false when ?live=1 on localhost", () => {
        vi.stubGlobal("window", { location: { hostname: "localhost", search: "?live=1" } });
        expect(shouldUseDemoAnalytics()).toBe(false);
    });

    it("returns true when ?demo=1 even on non-localhost", () => {
        vi.stubGlobal("window", { location: { hostname: "im-rihan.github.io", search: "?demo=1" } });
        expect(shouldUseDemoAnalytics()).toBe(true);
    });

    it("returns false on production host without query params", () => {
        vi.stubGlobal("window", { location: { hostname: "im-rihan.github.io", search: "" } });
        expect(shouldUseDemoAnalytics()).toBe(false);
    });

    it("respects NEXT_PUBLIC_DEMO_ANALYTICS=false env override", () => {
        vi.stubEnv("NEXT_PUBLIC_DEMO_ANALYTICS", "false");
        vi.stubGlobal("window", { location: { hostname: "localhost", search: "" } });
        expect(shouldUseDemoAnalytics()).toBe(false);
    });

    it("respects NEXT_PUBLIC_DEMO_ANALYTICS=true env override on prod host", () => {
        vi.stubEnv("NEXT_PUBLIC_DEMO_ANALYTICS", "true");
        vi.stubGlobal("window", { location: { hostname: "im-rihan.github.io", search: "" } });
        expect(shouldUseDemoAnalytics()).toBe(true);
    });
});
