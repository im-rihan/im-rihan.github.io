import { countryNames } from "@/data/country-coordinates";

export interface GeoResult {
    countryCode: string;
    countryName: string;
    city: string;
    region: string;
}

const GEO_TIMEOUT_MS = 5000;

export function isUnknownCountryCode(code: string): boolean {
    const c = code.trim().toUpperCase();
    return !c || c.length !== 2 || c === "XX" || c === "T1";
}

/** Normalize provider payloads to ISO alpha-2 + display name. */
export function normalizeGeoResult(
    code: string | undefined,
    name: string | undefined,
    city?: string,
    region?: string,
): GeoResult | null {
    const countryCode = (code ?? "").trim().toUpperCase();
    if (isUnknownCountryCode(countryCode)) return null;

    const countryName =
        name?.trim() ||
        countryNames[countryCode] ||
        countryCode;

    return {
        countryCode,
        countryName,
        city: city?.trim() ?? "",
        region: region?.trim() ?? "",
    };
}

async function fetchWithTimeout(
    input: RequestInfo | URL,
    init: RequestInit = {},
    timeoutMs = GEO_TIMEOUT_MS,
): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(input, { ...init, signal: controller.signal, cache: "no-store" });
    } finally {
        clearTimeout(timer);
    }
}

async function fetchFromIpwho(): Promise<GeoResult | null> {
    const res = await fetchWithTimeout("https://ipwho.is/");
    if (!res.ok) return null;
    const data = (await res.json()) as {
        success?: boolean;
        country_code?: string;
        country?: string;
        city?: string;
        region?: string;
    };
    if (data.success === false) return null;
    return normalizeGeoResult(data.country_code, data.country, data.city, data.region);
}

async function fetchFromIpapi(): Promise<GeoResult | null> {
    const res = await fetchWithTimeout("https://ipapi.co/json/");
    if (!res.ok) return null;
    const data = (await res.json()) as {
        error?: boolean;
        reason?: string;
        country_code?: string;
        country_name?: string;
        city?: string;
        region?: string;
    };
    if (data.error) return null;
    return normalizeGeoResult(data.country_code, data.country_name, data.city, data.region);
}

async function fetchFromGeoJs(): Promise<GeoResult | null> {
    const res = await fetchWithTimeout("https://get.geojs.io/v1/ip/geo.json");
    if (!res.ok) return null;
    const data = (await res.json()) as {
        country_code?: string;
        country?: string;
        city?: string;
        region?: string;
    };
    return normalizeGeoResult(data.country_code, data.country, data.city, data.region);
}

type GeoProvider = () => Promise<GeoResult | null>;

const GEO_PROVIDERS: GeoProvider[] = [fetchFromIpwho, fetchFromIpapi, fetchFromGeoJs];

/** Client-side geo lookup with provider fallbacks (no API keys). */
export async function fetchGeo(): Promise<GeoResult | null> {
    for (let attempt = 0; attempt < 2; attempt++) {
        for (const provider of GEO_PROVIDERS) {
            try {
                const result = await provider();
                if (result) return result;
            } catch {
                /* try next provider */
            }
        }
        if (attempt === 0) {
            await new Promise((resolve) => setTimeout(resolve, 350));
        }
    }
    return null;
}
