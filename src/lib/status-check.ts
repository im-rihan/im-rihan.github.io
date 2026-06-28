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
    if (target.type === "external") {
        return {
            name: target.name,
            url: target.url,
            status: "online",
            responseMs: null,
            note: "Profile link — open to verify",
        };
    }

    const start = performance.now();
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const response = await fetch(target.url, {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
        });
        clearTimeout(timeout);
        const ms = Math.round(performance.now() - start);

        if (!response.ok) {
            return {
                name: target.name,
                url: target.url,
                status: "offline",
                responseMs: ms,
                note: `HTTP ${response.status}`,
            };
        }

        return {
            name: target.name,
            url: target.url,
            status: ms > 2000 ? "slow" : "online",
            responseMs: ms,
        };
    } catch {
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
