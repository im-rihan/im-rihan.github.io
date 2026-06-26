import { countryNames } from "@/data/country-coordinates";
import { isSupabaseEnvConfigured } from "@/utils/supabase/env";
import { getBrowserClient } from "@/utils/supabase/client";

export interface VisitRecord {
    id: string;
    countryCode: string;
    countryName: string;
    city: string;
    region: string;
    deviceType: "desktop" | "mobile" | "tablet" | "unknown";
    deviceLabel: string;
    browser: string;
    os: string;
    page: string;
    timestamp: string;
}

export interface CountryStat {
    code: string;
    name: string;
    count: number;
}

export interface DeviceStat {
    type: VisitRecord["deviceType"];
    label: string;
    count: number;
}

export interface VisitorStats {
    total: number;
    globalTotal: number | null;
    countries: CountryStat[];
    devices: DeviceStat[];
    recent: VisitRecord[];
    current: VisitRecord | null;
}

const STORAGE_KEY = "rm-portfolio-visits";
const SESSION_KEY = "rm-portfolio-tracked";
const SEEN_COUNTRIES_KEY = "rm-seen-countries";
const COUNTAPI_NS = "im-rihan-portfolio";
const FETCH_TIMEOUT_MS = 5000;
const COUNTAPI_TIMEOUT_MS = 3000;

export const VISITOR_UPDATE_EVENT = "rm-visitor-update";

async function fetchWithTimeout(
    input: RequestInfo | URL,
    init: RequestInit = {},
    timeoutMs = FETCH_TIMEOUT_MS
): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(input, { ...init, signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}

async function countApiHit(key: string): Promise<void> {
    try {
        await fetchWithTimeout(
            `https://api.countapi.xyz/hit/${COUNTAPI_NS}/${key}`,
            {},
            COUNTAPI_TIMEOUT_MS
        );
    } catch {
        /* optional */
    }
}

async function countApiGet(key: string): Promise<number> {
    try {
        const res = await fetchWithTimeout(
            `https://api.countapi.xyz/get/${COUNTAPI_NS}/${key}`,
            {},
            COUNTAPI_TIMEOUT_MS
        );
        if (!res.ok) return 0;
        const data = (await res.json()) as { value?: number };
        return data.value ?? 0;
    } catch {
        return 0;
    }
}

function addSeenCountry(code: string): void {
    try {
        const seen: string[] = JSON.parse(localStorage.getItem(SEEN_COUNTRIES_KEY) || "[]");
        if (!seen.includes(code)) {
            seen.push(code);
            localStorage.setItem(SEEN_COUNTRIES_KEY, JSON.stringify(seen));
        }
    } catch {
        /* ignore */
    }
}

function getSeenCountries(): string[] {
    try {
        return JSON.parse(localStorage.getItem(SEEN_COUNTRIES_KEY) || "[]") as string[];
    } catch {
        return [];
    }
}

interface GeoResponse {
    success?: boolean;
    country_code?: string;
    country?: string;
    city?: string;
    region?: string;
}

function parseDevice(ua: string): Pick<VisitRecord, "deviceType" | "deviceLabel" | "browser" | "os"> {
    const lower = ua.toLowerCase();
    let deviceType: VisitRecord["deviceType"] = "desktop";
    if (/ipad|tablet/.test(lower)) deviceType = "tablet";
    else if (/mobile|android|iphone|ipod/.test(lower)) deviceType = "mobile";

    let browser = "Browser";
    if (lower.includes("edg/")) browser = "Edge";
    else if (lower.includes("chrome/")) browser = "Chrome";
    else if (lower.includes("firefox/")) browser = "Firefox";
    else if (lower.includes("safari/") && !lower.includes("chrome")) browser = "Safari";

    let os = "Unknown";
    if (lower.includes("windows")) os = "Windows";
    else if (lower.includes("mac os")) os = "macOS";
    else if (lower.includes("android")) os = "Android";
    else if (/iphone|ipad|ipod/.test(lower)) os = "iOS";
    else if (lower.includes("linux")) os = "Linux";

    const deviceLabel =
        deviceType === "mobile" ? `Mobile · ${os}` :
        deviceType === "tablet" ? `Tablet · ${os}` :
        `Desktop · ${os}`;

    return { deviceType, deviceLabel, browser, os };
}

function readVisits(): VisitRecord[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as VisitRecord[]) : [];
    } catch {
        return [];
    }
}

function writeVisits(visits: VisitRecord[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visits.slice(-500)));
}

async function fetchGeo(): Promise<GeoResponse | null> {
    try {
        const res = await fetchWithTimeout("https://ipwho.is/", { cache: "no-store" }, 6000);
        if (!res.ok) return null;
        const data = (await res.json()) as GeoResponse;
        return data.success === false ? null : data;
    } catch {
        return null;
    }
}

export function isSupabaseConfigured(): boolean {
    return isSupabaseEnvConfigured();
}

export interface SupabaseProbeResult {
    configured: boolean;
    ok: boolean;
    message: string;
}

function parseClientError(error: { code?: string; message?: string } | null): string {
    if (!error) return "Unknown Supabase error";
    if (error.code === "PGRST205") {
        return "Table public.visits is missing. Run supabase/visits.sql in Supabase → SQL Editor.";
    }
    if (error.message?.includes("JWT")) {
        return "Auth failed — check NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.";
    }
    return error.message ?? "Supabase request failed";
}

/** Health check for Supabase analytics backend. */
export async function probeSupabase(): Promise<SupabaseProbeResult> {
    if (!isSupabaseEnvConfigured()) {
        return { configured: false, ok: false, message: "Supabase env vars not set" };
    }

    const supabase = getBrowserClient();
    if (!supabase) {
        return { configured: false, ok: false, message: "Supabase client unavailable" };
    }

    try {
        const { error } = await supabase.from("visits").select("id").limit(1);
        if (!error) {
            return { configured: true, ok: true, message: "Connected — public.visits table ready" };
        }
        return { configured: true, ok: false, message: parseClientError(error) };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Network error";
        return { configured: true, ok: false, message: msg };
    }
}

async function fetchSupabaseVisits(): Promise<VisitRecord[] | null> {
    const supabase = getBrowserClient();
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from("visits")
            .select("*")
            .order("timestamp", { ascending: false })
            .limit(200);
        if (error) {
            if (process.env.NODE_ENV === "development") {
                console.warn("[analytics] Supabase read failed:", parseClientError(error));
            }
            return null;
        }
        return (data ?? []) as VisitRecord[];
    } catch (err) {
        if (process.env.NODE_ENV === "development") {
            console.warn("[analytics] Supabase read error:", err);
        }
        return null;
    }
}

async function pushSupabaseVisit(visit: VisitRecord): Promise<boolean> {
    const supabase = getBrowserClient();
    if (!supabase) return false;

    try {
        const { error } = await supabase.from("visits").insert(visit);
        if (error) {
            if (process.env.NODE_ENV === "development") {
                console.warn("[analytics] Supabase insert failed:", parseClientError(error));
            }
            return false;
        }
        return true;
    } catch (err) {
        if (process.env.NODE_ENV === "development") {
            console.warn("[analytics] Supabase insert error:", err);
        }
        return false;
    }
}

function aggregate(visits: VisitRecord[], current: VisitRecord | null): Omit<VisitorStats, "globalTotal"> {
    const countryMap = new Map<string, CountryStat>();
    const deviceMap = new Map<string, DeviceStat>();

    for (const v of visits) {
        const cKey = v.countryCode || "XX";
        const existing = countryMap.get(cKey);
        if (existing) existing.count += 1;
        else countryMap.set(cKey, { code: cKey, name: v.countryName || "Unknown", count: 1 });

        const dKey = v.deviceType;
        const dExisting = deviceMap.get(dKey);
        if (dExisting) dExisting.count += 1;
        else deviceMap.set(dKey, { type: dKey, label: v.deviceLabel, count: 1 });
    }

    return {
        total: visits.length,
        countries: [...countryMap.values()].sort((a, b) => b.count - a.count),
        devices: [...deviceMap.values()].sort((a, b) => b.count - a.count),
        recent: visits.slice(-8).reverse(),
        current,
    };
}

export async function trackVisit(page: string): Promise<VisitRecord | null> {
    if (typeof window === "undefined") return null;
    if (sessionStorage.getItem(SESSION_KEY)) return null;
    sessionStorage.setItem(SESSION_KEY, "1");

    const geo = await fetchGeo();
    const device = parseDevice(navigator.userAgent);

    const visit: VisitRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        countryCode: geo?.country_code ?? "XX",
        countryName: geo?.country ?? "Unknown",
        city: geo?.city ?? "",
        region: geo?.region ?? "",
        deviceType: device.deviceType,
        deviceLabel: device.deviceLabel,
        browser: device.browser,
        os: device.os,
        page,
        timestamp: new Date().toISOString(),
    };

    const visits = readVisits();
    visits.push(visit);
    writeVisits(visits);
    await pushSupabaseVisit(visit);

    const code = visit.countryCode.toLowerCase();
    addSeenCountry(visit.countryCode);
    await Promise.all([
        countApiHit("visits"),
        countApiHit(`country-${code}`),
        countApiHit(`device-${visit.deviceType}`),
    ]);

    window.dispatchEvent(new CustomEvent(VISITOR_UPDATE_EVENT));
    return visit;
}

async function fetchGlobalStats(localVisits: VisitRecord[]): Promise<{
    globalTotal: number | null;
    countries: CountryStat[];
    devices: DeviceStat[];
}> {
    const seenCodes = [...new Set([
        ...getSeenCountries(),
        ...localVisits.map((v) => v.countryCode),
    ])].slice(0, 12);

    const deviceTypes = ["desktop", "mobile", "tablet", "unknown"] as const;

    const [globalTotal, ...rest] = await Promise.all([
        countApiGet("visits"),
        ...seenCodes.map(async (code) => {
            const count = await countApiGet(`country-${code.toLowerCase()}`);
            if (count <= 0) return null;
            const name =
                localVisits.find((v) => v.countryCode === code)?.countryName ??
                countryNames[code.toUpperCase()] ??
                code;
            return { code, name, count } satisfies CountryStat;
        }),
        ...deviceTypes.map(async (type) => {
            const count = await countApiGet(`device-${type}`);
            if (count <= 0) return null;
            const label =
                type === "mobile" ? "Mobile" :
                type === "tablet" ? "Tablet" :
                type === "desktop" ? "Desktop" : "Unknown";
            return { type, label, count } satisfies DeviceStat;
        }),
    ]);

    const countryResults = rest.slice(0, seenCodes.length) as (CountryStat | null)[];
    const deviceResults = rest.slice(seenCodes.length) as (DeviceStat | null)[];

    return {
        globalTotal: globalTotal > 0 ? globalTotal : null,
        countries: countryResults.filter((c): c is CountryStat => c !== null).sort((a, b) => b.count - a.count),
        devices: deviceResults.filter((d): d is DeviceStat => d !== null).sort((a, b) => b.count - a.count),
    };
}

function isLocalhost(): boolean {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
}

/** True when localhost should show sample analytics (use ?live=1 to disable). */
export function shouldUseDemoAnalytics(): boolean {
    if (typeof window === "undefined") return false;
    if (!isLocalhost()) return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get("live") === "1") return false;
    return params.get("demo") === "1" || params.get("demo") !== "0";
}

export function getDemoVisitorStats(): VisitorStats & { source: "demo"; isDemo: true } {
    const now = Date.now();
    const ago = (hours: number) => new Date(now - hours * 3600_000).toISOString();

    const recent: VisitRecord[] = [
        { id: "d1", countryCode: "US", countryName: "United States", city: "San Francisco", region: "California", deviceType: "desktop", deviceLabel: "Desktop · macOS", browser: "Chrome", os: "macOS", page: "/", timestamp: ago(1) },
        { id: "d2", countryCode: "IN", countryName: "India", city: "Bengaluru", region: "Karnataka", deviceType: "mobile", deviceLabel: "Mobile · Android", browser: "Chrome", os: "Android", page: "/github", timestamp: ago(3) },
        { id: "d3", countryCode: "GB", countryName: "United Kingdom", city: "London", region: "England", deviceType: "desktop", deviceLabel: "Desktop · Windows", browser: "Edge", os: "Windows", page: "/chat", timestamp: ago(5) },
        { id: "d4", countryCode: "DE", countryName: "Germany", city: "Berlin", region: "Berlin", deviceType: "desktop", deviceLabel: "Desktop · Linux", browser: "Firefox", os: "Linux", page: "/", timestamp: ago(8) },
        { id: "d5", countryCode: "SG", countryName: "Singapore", city: "Singapore", region: "", deviceType: "mobile", deviceLabel: "Mobile · iOS", browser: "Safari", os: "iOS", page: "/gallery", timestamp: ago(12) },
        { id: "d6", countryCode: "CA", countryName: "Canada", city: "Toronto", region: "Ontario", deviceType: "tablet", deviceLabel: "Tablet · iOS", browser: "Safari", os: "iOS", page: "/status", timestamp: ago(18) },
        { id: "d7", countryCode: "AU", countryName: "Australia", city: "Sydney", region: "NSW", deviceType: "desktop", deviceLabel: "Desktop · Windows", browser: "Chrome", os: "Windows", page: "/", timestamp: ago(24) },
        { id: "d8", countryCode: "IN", countryName: "India", city: "Puri", region: "Odisha", deviceType: "desktop", deviceLabel: "Desktop · Windows", browser: "Chrome", os: "Windows", page: "/status", timestamp: ago(0.2) },
    ];

    return {
        total: 847,
        globalTotal: 847,
        countries: [
            { code: "US", name: "United States", count: 312 },
            { code: "IN", name: "India", count: 156 },
            { code: "GB", name: "United Kingdom", count: 89 },
            { code: "DE", name: "Germany", count: 67 },
            { code: "CA", name: "Canada", count: 45 },
            { code: "AU", name: "Australia", count: 38 },
            { code: "SG", name: "Singapore", count: 22 },
            { code: "FR", name: "France", count: 18 },
            { code: "NL", name: "Netherlands", count: 14 },
            { code: "JP", name: "Japan", count: 11 },
        ],
        devices: [
            { type: "desktop", label: "Desktop", count: 520 },
            { type: "mobile", label: "Mobile", count: 278 },
            { type: "tablet", label: "Tablet", count: 49 },
        ],
        recent,
        current: recent[recent.length - 1],
        source: "demo",
        isDemo: true,
    };
}

export async function getVisitorStats(_forceRefresh = false): Promise<
    VisitorStats & {
        source: "supabase" | "local" | "global" | "merged" | "demo";
        isDemo?: boolean;
        supabase?: SupabaseProbeResult;
    }
> {
    if (shouldUseDemoAnalytics()) {
        return getDemoVisitorStats();
    }

    const local = readVisits();
    const current = local[local.length - 1] ?? null;

    const [supabase, remoteVisits, global] = await Promise.all([
        probeSupabase(),
        isSupabaseEnvConfigured() ? fetchSupabaseVisits() : Promise.resolve(null),
        fetchGlobalStats(local),
    ]);

    const visitSource =
        supabase.ok && remoteVisits && remoteVisits.length > 0 ? remoteVisits : local;
    const localAgg = aggregate(visitSource, current);

    const countries =
        localAgg.countries.length > 0
            ? mergeCountryStats(localAgg.countries, global.countries)
            : global.countries;
    const devices =
        localAgg.devices.length > 0 && global.devices.length === 0
            ? localAgg.devices
            : global.devices.length > 0
              ? mergeDeviceStats(localAgg.devices, global.devices)
              : localAgg.devices;

    const total =
        supabase.ok && remoteVisits && remoteVisits.length > 0
            ? Math.max(remoteVisits.length, global.globalTotal ?? 0)
            : global.globalTotal ?? Math.max(localAgg.total, visitSource.length);

    const source =
        supabase.ok && remoteVisits && remoteVisits.length > 0
            ? global.globalTotal
                ? "merged"
                : "supabase"
            : global.globalTotal
              ? "merged"
              : "local";

    return {
        total,
        globalTotal: global.globalTotal,
        countries,
        devices,
        recent: localAgg.recent,
        current,
        source,
        supabase: isSupabaseEnvConfigured()
            ? supabase
            : {
                  configured: false,
                  ok: false,
                  message:
                      "Supabase not in production build — add NEXT_PUBLIC_SUPABASE_* GitHub Actions secrets and redeploy.",
              },
    };
}

function mergeDeviceStats(local: DeviceStat[], global: DeviceStat[]): DeviceStat[] {
    const map = new Map<string, DeviceStat>();
    for (const d of [...local, ...global]) {
        const existing = map.get(d.type);
        if (existing) existing.count = Math.max(existing.count, d.count);
        else map.set(d.type, { ...d });
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
}

function mergeCountryStats(local: CountryStat[], global: CountryStat[]): CountryStat[] {
    const map = new Map<string, CountryStat>();
    for (const c of [...local, ...global]) {
        const key = c.code.toUpperCase();
        const existing = map.get(key);
        if (existing) {
            existing.count = Math.max(existing.count, c.count);
        } else {
            map.set(key, { ...c, code: key });
        }
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
}
