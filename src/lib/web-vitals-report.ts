import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

export type VitalName = "CLS" | "FCP" | "INP" | "LCP" | "TTFB";
export type VitalRating = "good" | "needs-improvement" | "poor";

export interface VitalSample {
    name: VitalName;
    value: number;
    rating: VitalRating;
    timestamp: number;
}

type Listener = (samples: Record<string, VitalSample>) => void;

const samples: Record<string, VitalSample> = {};
const listeners = new Set<Listener>();
let started = false;

function notify() {
    listeners.forEach((listener) => listener({ ...samples }));
}

function sendToPlausible(sample: VitalSample) {
    const plausible = (window as unknown as { plausible?: (event: string, opts?: unknown) => void })
        .plausible;
    if (typeof plausible !== "function") return;
    plausible("Web Vitals", {
        props: {
            metric: sample.name,
            rating: sample.rating,
            value: Math.round(sample.name === "CLS" ? sample.value * 1000 : sample.value),
        },
    });
}

function record(metric: Metric) {
    const sample: VitalSample = {
        name: metric.name as VitalName,
        value: metric.value,
        rating: metric.rating,
        timestamp: Date.now(),
    };
    samples[sample.name] = sample;
    notify();
    sendToPlausible(sample);
}

/** Starts collecting Core Web Vitals once per page load. Safe to call repeatedly. */
export function startWebVitalsReporting() {
    if (started || typeof window === "undefined") return;
    started = true;
    onCLS(record);
    onFCP(record);
    onINP(record);
    onLCP(record);
    onTTFB(record);
}

export function getWebVitalsSnapshot(): Record<string, VitalSample> {
    return { ...samples };
}

export function subscribeWebVitals(listener: Listener): () => void {
    listeners.add(listener);
    listener({ ...samples });
    return () => listeners.delete(listener);
}
