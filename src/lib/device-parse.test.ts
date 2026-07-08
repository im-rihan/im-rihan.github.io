import { describe, expect, it } from "vitest";
import { parseDevice } from "./device-parse";

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
});
