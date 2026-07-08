import { describe, expect, it } from "vitest";
import { normalizeBrowserLabel, parseDevice } from "./device-parse";

describe("parseDevice", () => {
    it("detects iPhone Safari as iOS mobile", () => {
        const ua =
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
        const device = parseDevice(ua);
        expect(device.os).toBe("iOS");
        expect(device.deviceType).toBe("mobile");
        expect(device.deviceLabel).toBe("Mobile · iOS");
    });

    it("detects iPadOS reduced UA via touch hints", () => {
        const ua =
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
        const device = parseDevice(ua, { maxTouchPoints: 5 });
        expect(device.os).toBe("iOS");
        expect(device.deviceType).toBe("tablet");
    });

    it("keeps desktop macOS Safari without touch hints", () => {
        const ua =
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
        const device = parseDevice(ua, { maxTouchPoints: 0 });
        expect(device.os).toBe("macOS");
        expect(device.deviceType).toBe("desktop");
    });

    it("detects Edge, Samsung Internet, and in-app browsers", () => {
        expect(parseDevice("Mozilla/5.0 Edg/120.0").browser).toBe("Edge");
        expect(parseDevice("Mozilla/5.0 SamsungBrowser/24.0").browser).toBe("Samsung Internet");
        expect(parseDevice("Mozilla/5.0 LinkedInApp/1.0").browser).toBe("LinkedIn");
        expect(parseDevice("Mozilla/5.0 FBAN/FBIOS").browser).toBe("Facebook");
        expect(parseDevice("Mozilla/5.0 Instagram 300.0").browser).toBe("Instagram");
    });
});

describe("normalizeBrowserLabel", () => {
    it("groups browsers for analytics", () => {
        expect(normalizeBrowserLabel("Chrome")).toBe("Chrome family");
        expect(normalizeBrowserLabel("Edge")).toBe("Chrome family");
        expect(normalizeBrowserLabel("Safari")).toBe("Safari");
        expect(normalizeBrowserLabel("Firefox")).toBe("Firefox");
        expect(normalizeBrowserLabel("LinkedIn")).toBe("In-app browser");
    });
});
