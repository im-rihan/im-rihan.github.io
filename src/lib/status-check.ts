import type { StatusTarget } from "@/data/status-targets";
import { appendStatusHistory } from "@/lib/status-history";

export type LinkStatus = "online" | "slow" | "offline" | "unknown";

export interface StatusResult {
    name: string;
    url: string;
    status: LinkStatus;
    responseMs: number | null;
    note?: string;
    group: StatusTarget["group"];
    checkedAt: number;
}

const SLOW_MS = 2000;
const TIMEOUT_MS = 8000;

const STATUS_ORDER: Record<LinkStatus, number> = {
    offline: 0,
    unknown: 1,
    slow: 2,
    online: 3,
};

async function timedFetch(url: string, init?: RequestInit): Promise<{ ok: boolean; ms: number; status?: number }> {
    const start = performance.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const response = await fetch(url, {
            ...init,
            signal: controller.signal,
            cache: "no-store",
        });
        clearTimeout(timeout);
        const ms = Math.round(performance.now() - start);
        return { ok: response.ok, ms, status: response.status };
    } catch {
        clearTimeout(timeout);
        return { ok: false, ms: Math.round(performance.now() - start) };
    }
}

async function checkInternal(target: StatusTarget): Promise<StatusResult> {
    const { ok, ms, status } = await timedFetch(target.url, { method: "GET" });
    const checkedAt = Date.now();

    if (!ok) {
        return {
            name: target.name,
            url: target.url,
            group: target.group,
            checkedAt,
            status: "offline",
            responseMs: ms,
            note: status ? `HTTP ${status}` : "Unreachable",
        };
    }

    return {
        name: target.name,
        url: target.url,
        group: target.group,
        checkedAt,
        status: ms > SLOW_MS ? "slow" : "online",
        responseMs: ms,
    };
}

async function checkExternal(target: StatusTarget): Promise<StatusResult> {
    const checkedAt = Date.now();

    if (target.url.includes("api.github.com")) {
        const { ok, ms, status } = await timedFetch(target.url, {
            method: "GET",
            headers: { Accept: "application/vnd.github+json" },
        });
        if (!ok) {
            return {
                name: target.name,
                url: target.url,
                group: target.group,
                checkedAt,
                status: "offline",
                responseMs: ms,
                note: status ? `HTTP ${status}` : "API unreachable",
            };
        }
        return {
            name: target.name,
            url: target.url,
            group: target.group,
            checkedAt,
            status: ms > SLOW_MS ? "slow" : "online",
            responseMs: ms,
            note: "GitHub REST API",
        };
    }

    if (target.url.includes("linkedin.com")) {
        const { ok, ms } = await timedFetch(target.url, { method: "GET", mode: "no-cors" });
        return {
            name: target.name,
            url: target.url,
            group: target.group,
            checkedAt,
            status: ok ? (ms > SLOW_MS ? "slow" : "online") : "unknown",
            responseMs: ok ? ms : null,
            note: "Profile link — may block automated checks",
        };
    }

    const { ok, ms } = await timedFetch(target.url, { method: "GET", mode: "no-cors" });
    return {
        name: target.name,
        url: target.url,
        group: target.group,
        checkedAt,
        status: ok ? (ms > SLOW_MS ? "slow" : "online") : "unknown",
        responseMs: ok ? ms : null,
        note: ok ? "Reachability probe" : "Open link to verify",
    };
}

export async function checkLink(target: StatusTarget): Promise<StatusResult> {
    if (target.type === "internal") return checkInternal(target);
    return checkExternal(target);
}

export function sortStatusResults(results: StatusResult[]): StatusResult[] {
    return [...results].sort((a, b) => {
        const order = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
        if (order !== 0) return order;
        return (b.responseMs ?? 0) - (a.responseMs ?? 0);
    });
}

export async function checkAllLinks(
    targets: StatusTarget[],
    opts?: { persistHistory?: boolean },
): Promise<StatusResult[]> {
    const results = await Promise.all(targets.map(checkLink));
    const sorted = sortStatusResults(results);

    if (opts?.persistHistory !== false) {
        appendStatusHistory(
            sorted.map((r) => ({
                name: r.name,
                status: r.status,
                responseMs: r.responseMs,
            })),
        );
    }

    return sorted;
}

export type OverallHealth = "operational" | "degraded" | "outage";

export function computeOverallHealth(results: StatusResult[]): OverallHealth {
    if (results.length === 0) return "degraded";
    if (results.some((r) => r.status === "offline")) return "outage";
    if (results.some((r) => r.status === "slow" || r.status === "unknown")) return "degraded";
    return "operational";
}
