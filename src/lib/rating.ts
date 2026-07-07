/**
 * Plain-language "traffic light" rating shared by System Telemetry and Core
 * Web Vitals — translates jargon-heavy raw numbers (ms, %, MB) into a single
 * word anyone can read at a glance, without hiding the technical value.
 */
export type SimpleRating = "good" | "ok" | "poor";

export const RATING_LABEL: Record<SimpleRating, string> = {
    good: "Good",
    ok: "OK",
    poor: "Heavy",
};

/** For metrics where a *smaller* number is better (latency, memory use, layout shift...). */
export function rateLowerIsBetter(value: number, goodMax: number, okMax: number): SimpleRating {
    if (value <= goodMax) return "good";
    if (value <= okMax) return "ok";
    return "poor";
}

/** For metrics where a *larger* number is better (frames per second...). */
export function rateHigherIsBetter(value: number, goodMin: number, okMin: number): SimpleRating {
    if (value >= goodMin) return "good";
    if (value >= okMin) return "ok";
    return "poor";
}

/** Rolls up several ratings into one overall "worst wins" verdict. */
export function worstRating(ratings: SimpleRating[]): SimpleRating | null {
    if (ratings.length === 0) return null;
    if (ratings.includes("poor")) return "poor";
    if (ratings.includes("ok")) return "ok";
    return "good";
}
