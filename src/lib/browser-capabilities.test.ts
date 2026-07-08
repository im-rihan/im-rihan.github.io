import { describe, expect, it, vi } from "vitest";
import {
    isLowMemoryDevice,
    metricUnavailableCopy,
    supportsDeviceMemory,
    supportsJsHeapMetrics,
    supportsNetworkInformation,
} from "./browser-capabilities";

describe("browser-capabilities", () => {
    it("reports Chrome-only APIs as unavailable in node", () => {
        expect(supportsNetworkInformation()).toBe(false);
        expect(supportsJsHeapMetrics()).toBe(false);
        expect(supportsDeviceMemory()).toBe(false);
        expect(metricUnavailableCopy("heap")).toBe("Chrome only");
        expect(metricUnavailableCopy("network")).toBe("Not in this browser");
    });

    it("detects low-memory devices from navigator hints", () => {
        const nav = {
            deviceMemory: 2,
            hardwareConcurrency: 8,
        } as unknown as Navigator;
        vi.stubGlobal("navigator", nav);
        expect(isLowMemoryDevice()).toBe(true);
        vi.unstubAllGlobals();
    });
});
