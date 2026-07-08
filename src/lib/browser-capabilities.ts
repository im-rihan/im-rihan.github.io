/** Cross-browser capability probes used for progressive enhancement. */

export function isLowMemoryDevice(): boolean {
    if (typeof navigator === "undefined") return false;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (typeof mem === "number" && mem > 0 && mem <= 4) return true;
    const cores = navigator.hardwareConcurrency;
    if (typeof cores === "number" && cores > 0 && cores <= 2) return true;
    return false;
}

// Cache the probe result. Creating a canvas + WebGL context on every call
// leaks contexts (browsers cap at ~16), and this is called from
// useSyncExternalStore's getSnapshot which runs on every render.
let webglAvailable: boolean | null = null;

export function isWebGLAvailable(): boolean {
    if (webglAvailable !== null) return webglAvailable;
    if (typeof document === "undefined") return false;
    try {
        const canvas = document.createElement("canvas");
        const gl = (canvas.getContext("webgl2") ||
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
        webglAvailable = Boolean(gl);
        // Release the probe context immediately so it doesn't count toward the
        // browser's active-context limit.
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
        return webglAvailable;
    } catch {
        webglAvailable = false;
        return false;
    }
}

/** Chrome-only Network Information API */
export function supportsNetworkInformation(): boolean {
    if (typeof navigator === "undefined") return false;
    return "connection" in navigator;
}

/** Chrome-only JS heap via performance.memory */
export function supportsJsHeapMetrics(): boolean {
    if (typeof performance === "undefined") return false;
    return "memory" in performance;
}

/** Chrome-only navigator.deviceMemory */
export function supportsDeviceMemory(): boolean {
    if (typeof navigator === "undefined") return false;
    return "deviceMemory" in navigator;
}

export function metricUnavailableCopy(feature: "network" | "heap" | "deviceMemory"): string {
    switch (feature) {
        case "network":
            return supportsNetworkInformation() ? "—" : "Not in this browser";
        case "heap":
            return supportsJsHeapMetrics() ? "—" : "Chrome only";
        case "deviceMemory":
            return supportsDeviceMemory() ? "—" : "Not in this browser";
    }
}
