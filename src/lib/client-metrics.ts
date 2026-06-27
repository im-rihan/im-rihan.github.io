export type ClientMetrics = {
    fps: number;
    renderLoad: number;
    jsHeapMb: number | null;
    jsHeapLimitMb: number | null;
    deviceMemoryGb: number | null;
    cpuCores: number | null;
    networkType: string;
    networkRtt: number | null;
    sessionUptimeSec: number;
    pageLoadMs: number | null;
    storageKb: number;
};

type MemoryPerformance = Performance & {
    memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
};

type NetworkInformation = {
    effectiveType?: string;
    rtt?: number;
    downlink?: number;
};

function getConnection(): NetworkInformation | undefined {
    if (typeof navigator === "undefined") return undefined;
    return (navigator as Navigator & { connection?: NetworkInformation }).connection;
}

export function estimateStorageKb(): number {
    if (typeof localStorage === "undefined") return 0;
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        total += key.length + (localStorage.getItem(key)?.length ?? 0);
    }
    return Math.round(total / 1024);
}

export function readStaticMetrics(): Pick<
    ClientMetrics,
    "deviceMemoryGb" | "cpuCores" | "networkType" | "networkRtt" | "pageLoadMs" | "storageKb"
> {
    const conn = getConnection();
    const nav = typeof navigator !== "undefined" ? navigator : null;
    let pageLoadMs: number | null = null;
    if (typeof performance !== "undefined" && performance.timing?.loadEventEnd) {
        const { navigationStart, loadEventEnd } = performance.timing;
        if (loadEventEnd > 0) pageLoadMs = loadEventEnd - navigationStart;
    }

    return {
        deviceMemoryGb: nav && "deviceMemory" in nav ? (nav.deviceMemory as number) : null,
        cpuCores: nav?.hardwareConcurrency ?? null,
        networkType: conn?.effectiveType ?? "unknown",
        networkRtt: conn?.rtt ?? null,
        pageLoadMs,
        storageKb: estimateStorageKb(),
    };
}

export function readMemoryMetrics(): Pick<ClientMetrics, "jsHeapMb" | "jsHeapLimitMb"> {
    const mem = (performance as MemoryPerformance).memory;
    if (!mem) return { jsHeapMb: null, jsHeapLimitMb: null };
    return {
        jsHeapMb: Math.round(mem.usedJSHeapSize / 1048576),
        jsHeapLimitMb: Math.round(mem.jsHeapSizeLimit / 1048576),
    };
}

export function computeRenderLoad(fps: number): number {
    const target = 60;
    const load = Math.round(Math.max(0, Math.min(100, ((target - fps) / target) * 100 + 8)));
    return load;
}

export function formatUptime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}
