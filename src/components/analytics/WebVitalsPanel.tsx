"use client";

import { useEffect, useState } from "react";
import { Gauge } from "lucide-react";
import { subscribeWebVitals, type VitalName, type VitalSample } from "@/lib/web-vitals-report";
import { RATING_LABEL, worstRating, type SimpleRating } from "@/lib/rating";
import styles from "./SystemMetrics.module.css";

const VITAL_ORDER: VitalName[] = ["LCP", "INP", "CLS", "FCP", "TTFB"];

const VITAL_META: Record<
    VitalName,
    { label: string; unit: string; format: (v: number) => string; plain: string; explain: string }
> = {
    LCP: {
        label: "LCP",
        unit: "ms",
        format: (v) => String(Math.round(v)),
        plain: "Loading speed",
        explain: "Largest Contentful Paint — how long the main content took to appear.",
    },
    INP: {
        label: "INP",
        unit: "ms",
        format: (v) => String(Math.round(v)),
        plain: "Responsiveness",
        explain: "Interaction to Next Paint — how quickly the page reacts when you click or tap.",
    },
    CLS: {
        label: "CLS",
        unit: "",
        format: (v) => v.toFixed(3),
        plain: "Visual stability",
        explain: "Cumulative Layout Shift — how much content jumps around while loading.",
    },
    FCP: {
        label: "FCP",
        unit: "ms",
        format: (v) => String(Math.round(v)),
        plain: "First paint",
        explain: "First Contentful Paint — how long until something appears on screen.",
    },
    TTFB: {
        label: "TTFB",
        unit: "ms",
        format: (v) => String(Math.round(v)),
        plain: "Server speed",
        explain: "Time to First Byte — how quickly the server started responding.",
    },
};

function toSimpleRating(rating: VitalSample["rating"] | undefined): SimpleRating {
    if (rating === "poor") return "poor";
    if (rating === "needs-improvement") return "ok";
    return "good";
}

function ratingClass(rating: SimpleRating): string {
    if (rating === "poor") return styles.ratingPoor;
    if (rating === "ok") return styles.ratingOk;
    return styles.ratingGood;
}

function ratingBarClass(rating: VitalSample["rating"] | undefined): string {
    if (rating === "poor") return styles.barFillHot;
    if (rating === "needs-improvement") return styles.barFillWarn;
    return styles.barFill;
}

function ratingPct(rating: VitalSample["rating"] | undefined): number {
    if (rating === "poor") return 92;
    if (rating === "needs-improvement") return 58;
    if (rating === "good") return 24;
    return 4;
}

const SUMMARY_COPY: Record<SimpleRating, string> = {
    good: "Page speed: excellent — fast and stable so far.",
    ok: "Page speed: good, with a little room to improve.",
    poor: "Page speed: sluggish on one or more metrics.",
};

/**
 * Surfaces real Core Web Vitals (LCP/INP/CLS/FCP/TTFB) for the *current*
 * session on the status dashboard — the same numbers also get forwarded to
 * Plausible (when configured) as "Web Vitals" custom events for aggregate
 * tracking across all visitors.
 */
export function WebVitalsPanel() {
    const [samples, setSamples] = useState<Record<string, VitalSample>>({});

    useEffect(() => subscribeWebVitals(setSamples), []);

    const hasAny = Object.keys(samples).length > 0;
    const overall = worstRating(Object.values(samples).map((s) => toSimpleRating(s.rating)));

    return (
        <section className={`glass-card ${styles.panel}`} aria-label="Core Web Vitals">
            <div className={styles.glowBorder} aria-hidden />
            <span className={`${styles.corner} ${styles.cornerTl}`} aria-hidden />
            <span className={`${styles.corner} ${styles.cornerTr}`} aria-hidden />
            <span className={`${styles.corner} ${styles.cornerBl}`} aria-hidden />
            <span className={`${styles.corner} ${styles.cornerBr}`} aria-hidden />

            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Gauge size={20} />
                    <div>
                        <h2>Core Web Vitals</h2>
                        <p className={styles.sub}>this session · real user metrics</p>
                    </div>
                </div>
                <span className={styles.live}>
                    <span className={styles.liveDot} aria-hidden />
                    {hasAny ? "measured" : "measuring"}
                </span>
            </div>

            {hasAny && (
                <p className={styles.summary}>
                    <span
                        className={`${styles.summaryDot} ${
                            overall === "poor" ? styles.summaryDotPoor : overall === "ok" ? styles.summaryDotOk : ""
                        }`}
                        aria-hidden
                    />
                    {SUMMARY_COPY[overall ?? "good"]}
                </p>
            )}

            <div className={styles.grid}>
                {VITAL_ORDER.map((name) => {
                    const sample = samples[name];
                    const meta = VITAL_META[name];
                    const rating = sample ? toSimpleRating(sample.rating) : undefined;
                    return (
                        <div className={styles.metric} key={name} title={`${meta.label} — ${meta.explain}`}>
                            <div className={styles.ratingRow}>
                                <div className={styles.metricHead}>
                                    <span>{meta.plain}</span>
                                </div>
                                {rating && (
                                    <span className={`${styles.ratingChip} ${ratingClass(rating)}`}>
                                        {RATING_LABEL[rating]}
                                    </span>
                                )}
                            </div>
                            <div className={styles.value}>
                                {sample ? meta.format(sample.value) : "—"}
                                {sample && meta.unit && <span className={styles.unit}>{meta.unit}</span>}
                            </div>
                            <div className={styles.barTrack} aria-hidden>
                                <div
                                    className={`${styles.barFill} ${ratingBarClass(sample?.rating)}`}
                                    style={{ width: `${ratingPct(sample?.rating)}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className={styles.hint}>
                Real performance from this visit — hover any card for the technical name.
                {!hasAny && " Some metrics only finalize after you interact with or leave the page."}
            </p>
        </section>
    );
}
