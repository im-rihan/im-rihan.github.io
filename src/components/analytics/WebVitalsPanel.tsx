"use client";

import { useEffect, useState } from "react";
import { Gauge } from "lucide-react";
import { subscribeWebVitals, type VitalName, type VitalSample } from "@/lib/web-vitals-report";
import styles from "./SystemMetrics.module.css";

const VITAL_ORDER: VitalName[] = ["LCP", "INP", "CLS", "FCP", "TTFB"];

const VITAL_META: Record<VitalName, { label: string; unit: string; format: (v: number) => string }> = {
    LCP: { label: "LCP", unit: "ms", format: (v) => String(Math.round(v)) },
    INP: { label: "INP", unit: "ms", format: (v) => String(Math.round(v)) },
    CLS: { label: "CLS", unit: "", format: (v) => v.toFixed(3) },
    FCP: { label: "FCP", unit: "ms", format: (v) => String(Math.round(v)) },
    TTFB: { label: "TTFB", unit: "ms", format: (v) => String(Math.round(v)) },
};

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

            <div className={styles.grid}>
                {VITAL_ORDER.map((name) => {
                    const sample = samples[name];
                    const meta = VITAL_META[name];
                    return (
                        <div className={styles.metric} key={name}>
                            <div className={styles.metricHead}>
                                <span>{meta.label}</span>
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
                <code>LCP</code> largest contentful paint · <code>INP</code> interaction latency ·{" "}
                <code>CLS</code> layout shift · <code>FCP</code> first paint · <code>TTFB</code> time to
                first byte. Some metrics (INP, CLS) only finalize after you interact with or leave the
                page.
            </p>
        </section>
    );
}
