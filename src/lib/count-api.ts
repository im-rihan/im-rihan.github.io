/**
 * Free public hit counters — no signup, no database of ours.
 * Opt out with NEXT_PUBLIC_COUNTAPI_ENABLED=false.
 *
 * Primary: countapi.mileshilliard.com (CountAPI.xyz successor)
 * Fallback: abacus.jsn.cam
 */

const KEY_PREFIX = "im-rihan-portfolio";
const TIMEOUT_MS = 3000;

const PRIMARY = {
    hit: (key: string) => `https://countapi.mileshilliard.com/api/v1/hit/${encodeURIComponent(key)}`,
    get: (key: string) => `https://countapi.mileshilliard.com/api/v1/get/${encodeURIComponent(key)}`,
} as const;

/** Abacus uses namespace/key paths. */
const FALLBACK = {
    hit: (key: string) => `https://abacus.jsn.cam/hit/${KEY_PREFIX}/${encodeURIComponent(key)}`,
    get: (key: string) => `https://abacus.jsn.cam/get/${KEY_PREFIX}/${encodeURIComponent(key)}`,
} as const;

export function isCountApiEnabled(): boolean {
    return process.env.NEXT_PUBLIC_COUNTAPI_ENABLED !== "false";
}

/** Build a globally unique public key (mileshilliard has no namespaces). */
export function countApiKey(suffix: string): string {
    return `${KEY_PREFIX}-${suffix}`;
}

async function fetchWithTimeout(url: string, timeoutMs = TIMEOUT_MS): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, { signal: controller.signal, cache: "no-store" });
    } finally {
        clearTimeout(timer);
    }
}

function parseValue(data: unknown): number {
    if (!data || typeof data !== "object") return 0;
    const raw = (data as { value?: unknown }).value;
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
    if (typeof raw === "string") {
        const n = Number(raw);
        return Number.isFinite(n) ? n : 0;
    }
    return 0;
}

async function getFrom(url: string): Promise<number | null> {
    try {
        const res = await fetchWithTimeout(url);
        if (!res.ok) return null;
        return parseValue(await res.json());
    } catch {
        return null;
    }
}

async function hitFrom(url: string): Promise<number | null> {
    try {
        const res = await fetchWithTimeout(url);
        if (!res.ok) return null;
        return parseValue(await res.json());
    } catch {
        return null;
    }
}

/** Increment a free public counter. Returns new value, or null if both hosts fail. */
export async function countApiHit(suffix: string): Promise<number | null> {
    if (!isCountApiEnabled()) return null;
    const key = countApiKey(suffix);
    const primary = await hitFrom(PRIMARY.hit(key));
    if (primary !== null) return primary;
    return hitFrom(FALLBACK.hit(suffix));
}

/** Read a free public counter without incrementing. */
export async function countApiGet(suffix: string): Promise<number> {
    if (!isCountApiEnabled()) return 0;
    const key = countApiKey(suffix);
    const primary = await getFrom(PRIMARY.get(key));
    if (primary !== null) return primary;
    const fallback = await getFrom(FALLBACK.get(suffix));
    return fallback ?? 0;
}
