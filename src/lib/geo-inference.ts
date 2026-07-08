import type { GeoResult } from "@/lib/geo-lookup";
import { isUnknownCountryCode } from "@/lib/geo-lookup";
import type { VisitRecord } from "@/lib/visitor-analytics";

export interface GeoInferenceHints {
    currentGeo?: GeoResult | null;
    currentDevice?: Pick<VisitRecord, "browser" | "os" | "deviceType">;
}

type DeviceFingerprint = Pick<VisitRecord, "browser" | "os" | "deviceType">;

function deviceFingerprint(visit: DeviceFingerprint): string {
    return `${visit.browser}|${visit.os}|${visit.deviceType}`;
}

function pickGeoFromVisit(visit: VisitRecord): GeoResult {
    return {
        countryCode: visit.countryCode,
        countryName: visit.countryName,
        city: visit.city,
        region: visit.region,
    };
}

function newestResolvedSibling(
    visit: VisitRecord,
    visits: VisitRecord[],
): VisitRecord | null {
    const fp = deviceFingerprint(visit);
    return (
        visits
            .filter(
                (candidate) =>
                    !isUnknownCountryCode(candidate.countryCode) &&
                    deviceFingerprint(candidate) === fp,
            )
            .sort(
                (a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
            )[0] ?? null
    );
}

/** Fill XX rows from resolved visits on the same browser/OS/device profile. */
export function inferVisitGeo(
    visit: VisitRecord,
    visits: VisitRecord[],
    hints: GeoInferenceHints = {},
): VisitRecord {
    if (!isUnknownCountryCode(visit.countryCode)) return visit;

    const sibling = newestResolvedSibling(visit, visits);
    if (sibling) {
        const geo = pickGeoFromVisit(sibling);
        return { ...visit, ...geo };
    }

    const { currentGeo, currentDevice } = hints;
    if (
        currentGeo &&
        currentDevice &&
        deviceFingerprint(currentDevice) === deviceFingerprint(visit)
    ) {
        return { ...visit, ...currentGeo };
    }

    return visit;
}

export function inferUnresolvedVisits(
    visits: VisitRecord[],
    hints: GeoInferenceHints = {},
): VisitRecord[] {
    return visits.map((visit) => inferVisitGeo(visit, visits, hints));
}

export function visitGeoWasInferred(
    original: VisitRecord,
    resolved: VisitRecord,
): boolean {
    return (
        isUnknownCountryCode(original.countryCode) &&
        !isUnknownCountryCode(resolved.countryCode)
    );
}
