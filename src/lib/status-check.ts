import type { StatusTarget } from "@/data/status-targets";

export type LinkStatus = "online" | "slow" | "offline" | "unknown";

export interface StatusResult {
    name: string;
    url: string;
    status: LinkStatus;
    responseMs: number | null;
    note?: string;
}

export async function checkLink(target: StatusTarget): Promise<StatusResult> {
    const start = performance.now();
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(target.url, {
            method: "HEAD",
            mode: "no-cors",
            signal: controller.signal,
            cache: "no-store",
        });
        clearTimeout(timeout);
        const ms = Math.round(performance.now() - start);

        if (target.type === "external") {
            return {
                name: target.name,
                url: target.url,
                status: "unknown",
                responseMs: ms,
                note: "External — open link to verify (CORS restricted)",
            };
        }

        return {
            name: target.name,
            url: target.url,
            status: ms > 2000 ? "slow" : "online",
            responseMs: ms,
        };
    } catch {
        if (target.type === "external") {
            return {
                name: target.name,
                url: target.url,
                status: "unknown",
                responseMs: null,
                note: "External — open link to verify",
            };
        }
        return {
            name: target.name,
            url: target.url,
            status: "offline",
            responseMs: null,
        };
    }
}

export async function checkAllLinks(targets: StatusTarget[]): Promise<StatusResult[]> {
    return Promise.all(targets.map(checkLink));
}
