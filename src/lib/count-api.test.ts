import { describe, expect, it, vi, afterEach } from "vitest";
import { isCountApiEnabled } from "./count-api";

describe("isCountApiEnabled", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("is enabled by default", () => {
        vi.stubEnv("NEXT_PUBLIC_COUNTAPI_ENABLED", undefined);
        expect(isCountApiEnabled()).toBe(true);
    });

    it("is disabled when explicitly set to false", () => {
        vi.stubEnv("NEXT_PUBLIC_COUNTAPI_ENABLED", "false");
        expect(isCountApiEnabled()).toBe(false);
    });
});
