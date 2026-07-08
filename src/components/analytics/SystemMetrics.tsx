"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Activity, Cpu, HardDrive, MemoryStick, Network, Timer, Zap } from "lucide-react";
import {
    metricUnavailableCopy,
    supportsNetworkInformation,
} from "@/lib/browser-capabilities";
import {
    computeRenderLoad,
    formatUptime,
    readMemoryMetrics,
    readStaticMetrics,
    type ClientMetrics,
} from "@/lib/client-metrics";
import { RATING_LABEL, rateHigherIsBetter, rateLowerIsBetter, worstRating, type SimpleRating } from "@/lib/rating";
import { useAnimatedNumber } from "@/lib/use-animated-number";
import styles from "./SystemMetrics.module.css";

function loadBarClass(pct: number): string {
    if (pct >= 75) return styles.barFillHot;
    if (pct >= 50) return styles.barFillWarn;
    return styles.barFill;
}

function ratingClass(rating: SimpleRating): string {
    if (rating === "poor") return styles.ratingPoor;
    if (rating === "ok") return styles.ratingOk;
    return styles.ratingGood;
}

/**
 * The bar's fill color must track the metric's actual rating, not a raw
 * percentage — otherwise "higher is better" metrics like FPS light up red
 * at their *best* value, which is the opposite of what the color should say.
 */
function barFillClass(pct: number, rating?: SimpleRating): string {
    if (rating === "poor") return styles.barFillHot;
    if (rating === "ok") return styles.barFillWarn;
    if (rating === "good") return styles.barFill;
    return loadBarClass(pct);
}

function MetricBar({
    icon,
    label,
    value,
    unit,
    pct,
    showBar = true,
    rating,
    title,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    unit?: string;
    pct?: number;
    showBar?: boolean;
    rating?: SimpleRating;
    title?: string;
}) {
    return (
        <div className={styles.metric} title={title}>
            <div className={styles.ratingRow}>
                <div className={styles.metricHead}>
                    {icon}
                    <span>{label}</span>
                </div>
                {rating && <span className={`${styles.ratingChip} ${ratingClass(rating)}`}>{RATING_LABEL[rating]}</span>}
            </div>
            <div className={styles.value}>
                {value}
                {unit && <span className={styles.unit}>{unit}</span>}
            </div>
            {showBar && pct !== undefined && (
                <div className={styles.barTrack} aria-hidden>
                    <div
                        className={`${styles.barFill} ${barFillClass(pct, rating)}`}
                        style={{ width: `${Math.min(100, Math.max(4, pct))}%` }}
                    />
                </div>
            )}
        </div>
    );
}

const SUMMARY_COPY: Record<SimpleRating, string> = {
    good: "Running smoothly — no performance issues detected.",
    ok: "Mostly smooth, with a little extra load right now.",
    poor: "Running hot — your device or connection is under load.",
};

// Module-level constant: Date.now() runs once when the module is first imported
// (always in the browser for this "use client" file), keeping the render pure.
const MODULE_LOAD_TIME = Date.now();

export function SystemMetrics({ networkLatencyMs }: { networkLatencyMs?: number | null }) {
    const sessionStart = useRef(MODULE_LOAD_TIME);
    const [metrics, setMetrics] = useState<ClientMetrics>(() => ({
        fps: 60,
        renderLoad: 8,
        jsHeapMb: null,
        jsHeapLimitMb: null,
        deviceMemoryGb: null,
        cpuCores: null,
        networkType: "unknown",
        networkRtt: null,
        sessionUptimeSec: 0,
        pageLoadMs: null,
        storageKb: 0,
    }));

    useEffect(() => {
        const staticM = readStaticMetrics();
        let frames = 0;
        let last = performance.now();
        let raf = 0;

        const tick = (now: number) => {
            frames++;
            const elapsed = now - last;
            if (elapsed >= 1000) {
                const fps = Math.round((frames * 1000) / elapsed);
                const mem = readMemoryMetrics();
                const conn = readStaticMetrics();
                setMetrics((prev) => ({
                    ...prev,
                    fps,
                    renderLoad: computeRenderLoad(fps),
                    ...mem,
                    networkType: conn.networkType,
                    networkRtt: conn.networkRtt,
                    sessionUptimeSec: Math.floor((Date.now() - sessionStart.current) / 1000),
                    storageKb: conn.storageKb,
                }));
                frames = 0;
                last = now;
            }
            raf = requestAnimationFrame(tick);
        };

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMetrics((prev) => ({ ...prev, ...staticM, ...readMemoryMetrics() }));
        raf = requestAnimationFrame(tick);

        const interval = setInterval(() => {
            const conn = readStaticMetrics();
            setMetrics((prev) => ({
                ...prev,
                sessionUptimeSec: Math.floor((Date.now() - sessionStart.current) / 1000),
                storageKb: conn.storageKb,
                networkType: conn.networkType,
                networkRtt: conn.networkRtt,
                ...readMemoryMetrics(),
            }));
        }, 5000);

        return () => {
            cancelAnimationFrame(raf);
            clearInterval(interval);
        };
    }, []);

    const heapPct =
        metrics.jsHeapMb !== null && metrics.jsHeapLimitMb
            ? Math.round((metrics.jsHeapMb / metrics.jsHeapLimitMb) * 100)
            : metrics.deviceMemoryGb
              ? Math.min(65, Math.round(metrics.renderLoad * 0.8 + 12))
              : null;

    const latency = networkLatencyMs ?? metrics.networkRtt;
    const latencyPct = latency !== null && latency !== undefined ? Math.min(100, Math.round((latency / 800) * 100)) : null;

    const fpsRating = rateHigherIsBetter(metrics.fps, 50, 30);
    const loadRating = rateLowerIsBetter(metrics.renderLoad, 35, 65);
    const heapRating = heapPct !== null ? rateLowerIsBetter(heapPct, 50, 80) : null;
    const latencyRating =
        latency !== null && latency !== undefined ? rateLowerIsBetter(latency, 150, 400) : null;
    const overall =
        worstRating([fpsRating, loadRating, heapRating, latencyRating].filter((r): r is SimpleRating => r !== null)) ??
        "good";

    const animatedFps = useAnimatedNumber(metrics.fps);
    const animatedLoad = useAnimatedNumber(metrics.renderLoad);

    return (
        <section className={`glass-card ${styles.panel}`} aria-label="Client system metrics">
            <div className={styles.glowBorder} aria-hidden />
            <span className={`${styles.corner} ${styles.cornerTl}`} aria-hidden />
            <span className={`${styles.corner} ${styles.cornerTr}`} aria-hidden />
            <span className={`${styles.corner} ${styles.cornerBl}`} aria-hidden />
            <span className={`${styles.corner} ${styles.cornerBr}`} aria-hidden />

            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Activity size={20} />
                    <div>
                        <h2>System Telemetry</h2>
                        <p className={styles.sub}>browser · session · render pipeline</p>
                    </div>
                </div>
                <span className={styles.live}>
                    <span className={styles.liveDot} aria-hidden />
                    sampling
                </span>
            </div>

            <p className={styles.summary}>
                <span
                    className={`${styles.summaryDot} ${
                        overall === "poor" ? styles.summaryDotPoor : overall === "ok" ? styles.summaryDotOk : ""
                    }`}
                    aria-hidden
                />
                {SUMMARY_COPY[overall]}
            </p>

            <div className={styles.grid}>
                <MetricBar
                    icon={<Cpu size={15} />}
                    label="Render load"
                    value={String(Math.round(animatedLoad))}
                    unit="%"
                    pct={metrics.renderLoad}
                    rating={loadRating}
                    title="Estimated GPU/CPU work from the 3D scene and animations — lower is lighter on your device."
                />
                <MetricBar
                    icon={<MemoryStick size={15} />}
                    label="JS heap"
                    value={metrics.jsHeapMb !== null ? String(metrics.jsHeapMb) : metricUnavailableCopy("heap")}
                    unit={metrics.jsHeapMb !== null ? "MB" : undefined}
                    pct={heapPct ?? undefined}
                    showBar={heapPct !== null}
                    rating={heapRating ?? undefined}
                    title="Memory this tab is currently using in your browser."
                />
                <MetricBar
                    icon={<HardDrive size={15} />}
                    label="Device RAM"
                    value={
                        metrics.deviceMemoryGb !== null
                            ? String(metrics.deviceMemoryGb)
                            : metricUnavailableCopy("deviceMemory")
                    }
                    unit={metrics.deviceMemoryGb !== null ? "GB" : undefined}
                    pct={metrics.deviceMemoryGb ? Math.min(100, metrics.deviceMemoryGb * 12) : undefined}
                    showBar={metrics.deviceMemoryGb !== null}
                    title="Total memory reported by your device — not specific to this site."
                />
                <MetricBar
                    icon={<Zap size={15} />}
                    label="FPS"
                    value={String(Math.round(animatedFps))}
                    pct={Math.min(100, Math.round((metrics.fps / 60) * 100))}
                    rating={fpsRating}
                    title="Frames per second — 60 is buttery smooth, under 30 feels sluggish."
                />
                <MetricBar
                    icon={<Network size={15} />}
                    label="Network"
                    value={
                        latency !== null && latency !== undefined
                            ? String(latency)
                            : supportsNetworkInformation()
                              ? metrics.networkType
                              : metricUnavailableCopy("network")
                    }
                    unit={latency !== null && latency !== undefined ? "ms RTT" : undefined}
                    pct={latencyPct ?? undefined}
                    showBar={latencyPct !== null}
                    rating={latencyRating ?? undefined}
                    title="Round-trip time to load data — lower means a snappier connection."
                />
                <MetricBar
                    icon={<Timer size={15} />}
                    label="Session"
                    value={formatUptime(metrics.sessionUptimeSec)}
                    showBar={false}
                    title="How long you've had this page open."
                />
                <MetricBar
                    icon={<Cpu size={15} />}
                    label="CPU cores"
                    value={metrics.cpuCores !== null ? String(metrics.cpuCores) : "—"}
                    showBar={false}
                    title="Logical processor cores reported by your device."
                />
                <MetricBar
                    icon={<HardDrive size={15} />}
                    label="Local storage"
                    value={String(metrics.storageKb)}
                    unit="KB"
                    pct={Math.min(100, Math.round(metrics.storageKb / 50))}
                    title="Data this site has saved in your browser (theme, cached analytics, etc.)."
                />
            </div>

            <p className={styles.hint}>
                Sampled live from your browser — hover any card for what it means.
                {metrics.pageLoadMs !== null && (
                    <> This page loaded in <code>{metrics.pageLoadMs}ms</code>.</>
                )}
                <span className={styles.termCursor} aria-hidden />
            </p>
        </section>
    );
}
