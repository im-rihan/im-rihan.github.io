import { countryNames } from "@/data/country-coordinates";

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

async function countApiHit(key: string): Promise<void> {
    try {
        await fetch(`https://api.countapi.xyz/hit/${COUNTAPI_NS}/${key}`);
    } catch {
        /* optional */
    }
}

async function countApiGet(key: string): Promise<number> {
    try {
        const res = await fetch(`https://api.countapi.xyz/get/${COUNTAPI_NS}/${key}`);
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
        const res = await fetch("https://ipwho.is/", { cache: "no-store" });
        if (!res.ok) return null;
        const data = (await res.json()) as GeoResponse;
        return data.success === false ? null : data;
    } catch {
        return null;
    }
}

async function fetchSupabaseVisits(): Promise<VisitRecord[] | null> {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;

    try {
        const res = await fetch(
            `${url}/rest/v1/visits?select=*&order=timestamp.desc&limit=200`,
            {
                headers: {
                    apikey: key,
                    Authorization: `Bearer ${key}`,
                },
                cache: "no-store",
            }
        );
        if (!res.ok) return null;
        return (await res.json()) as VisitRecord[];
    } catch {
        return null;
    }
}

async function pushSupabaseVisit(visit: VisitRecord): Promise<void> {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    try {
        await fetch(`${url}/rest/v1/visits`, {
            method: "POST",
            headers: {
                apikey: key,
                Authorization: `Bearer ${key}`,
                "Content-Type": "application/json",
                Prefer: "return=minimal",
            },
            body: JSON.stringify(visit),
        });
    } catch {
        /* optional backend */
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

    return visit;
}

async function fetchGlobalStats(localVisits: VisitRecord[]): Promise<{
    globalTotal: number | null;
    countries: CountryStat[];
    devices: DeviceStat[];
}> {
    const globalTotal = await countApiGet("visits");
    const seenCodes = new Set([
        ...getSeenCountries(),
        ...localVisits.map((v) => v.countryCode),
    ]);

    const countryStats: CountryStat[] = [];
    for (const code of seenCodes) {
        const count = await countApiGet(`country-${code.toLowerCase()}`);
        if (count > 0) {
            const name =
                localVisits.find((v) => v.countryCode === code)?.countryName ??
                countryNames[code.toUpperCase()] ??
                code;
            countryStats.push({ code, name, count });
        }
    }

    const deviceTypes = ["desktop", "mobile", "tablet", "unknown"] as const;
    const deviceStats: DeviceStat[] = [];
    for (const type of deviceTypes) {
        const count = await countApiGet(`device-${type}`);
        if (count > 0) {
            const label =
                type === "mobile" ? "Mobile" :
                type === "tablet" ? "Tablet" :
                type === "desktop" ? "Desktop" : "Unknown";
            deviceStats.push({ type, label, count });
        }
    }

    return {
        globalTotal: globalTotal > 0 ? globalTotal : null,
        countries: countryStats.sort((a, b) => b.count - a.count),
        devices: deviceStats.sort((a, b) => b.count - a.count),
    };
}

export async function getVisitorStats(): Promise<VisitorStats & { source: "supabase" | "local" | "global" }> {
    const local = readVisits();
    const remote = await fetchSupabaseVisits();
    const visits = remote && remote.length > 0 ? remote : local;
    const current = visits[visits.length - 1] ?? null;
    const global = await fetchGlobalStats(visits);

    const useGlobal = global.globalTotal !== null;

    if (useGlobal) {
        const localAgg = aggregate(visits, current);
        return {
            total: global.globalTotal ?? visits.length,
            globalTotal: global.globalTotal,
            countries: global.countries.length > 0 ? global.countries : localAgg.countries,
            devices: global.devices.length > 0 ? global.devices : localAgg.devices,
            recent: visits.slice(-8).reverse(),
            current,
            source: "global",
        };
    }

    return {
        ...aggregate(visits, current),
        globalTotal: null,
        source: remote && remote.length > 0 ? "supabase" : "local",
    };
}
