"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Activity, Cpu, HardDrive, MemoryStick, Network, Timer, Zap } from "lucide-react";
import {
    computeRenderLoad,
    formatUptime,
    readMemoryMetrics,
    readStaticMetrics,
    type ClientMetrics,
} from "@/lib/client-metrics";
import styles from "./SystemMetrics.module.css";

function loadBarClass(pct: number): string {
    if (pct >= 75) return styles.barFillHot;
    if (pct >= 50) return styles.barFillWarn;
    return styles.barFill;
}

function MetricBar({
    icon,
    label,
    value,
    unit,
    pct,
    showBar = true,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    unit?: string;
    pct?: number;
    showBar?: boolean;
}) {
    return (
        <div className={styles.metric}>
            <div className={styles.metricHead}>
                {icon}
                <span>{label}</span>
            </div>
            <div className={styles.value}>
                {value}
                {unit && <span className={styles.unit}>{unit}</span>}
            </div>
            {showBar && pct !== undefined && (
                <div className={styles.barTrack} aria-hidden>
                    <div
                        className={`${styles.barFill} ${loadBarClass(pct)}`}
                        style={{ width: `${Math.min(100, Math.max(4, pct))}%` }}
                    />
                </div>
            )}
        </div>
    );
}

export function SystemMetrics({ networkLatencyMs }: { networkLatencyMs?: number | null }) {
    const sessionStart = useRef(Date.now());
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

        setMetrics((prev) => ({
            ...prev,
            ...staticM,
            ...readMemoryMetrics(),
        }));
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

            <div className={styles.grid}>
                <MetricBar
                    icon={<Cpu size={15} />}
                    label="Render load"
                    value={String(metrics.renderLoad)}
                    unit="%"
                    pct={metrics.renderLoad}
                />
                <MetricBar
                    icon={<MemoryStick size={15} />}
                    label="JS heap"
                    value={metrics.jsHeapMb !== null ? String(metrics.jsHeapMb) : "—"}
                    unit={metrics.jsHeapMb !== null ? "MB" : undefined}
                    pct={heapPct ?? undefined}
                    showBar={heapPct !== null}
                />
                <MetricBar
                    icon={<HardDrive size={15} />}
                    label="Device RAM"
                    value={metrics.deviceMemoryGb !== null ? String(metrics.deviceMemoryGb) : "—"}
                    unit={metrics.deviceMemoryGb !== null ? "GB" : undefined}
                    pct={metrics.deviceMemoryGb ? Math.min(100, metrics.deviceMemoryGb * 12) : undefined}
                    showBar={metrics.deviceMemoryGb !== null}
                />
                <MetricBar
                    icon={<Zap size={15} />}
                    label="FPS"
                    value={String(metrics.fps)}
                    pct={Math.min(100, Math.round((metrics.fps / 60) * 100))}
                />
                <MetricBar
                    icon={<Network size={15} />}
                    label="Network"
                    value={latency !== null && latency !== undefined ? String(latency) : metrics.networkType}
                    unit={latency !== null && latency !== undefined ? "ms RTT" : undefined}
                    pct={latencyPct ?? undefined}
                    showBar={latencyPct !== null}
                />
                <MetricBar
                    icon={<Timer size={15} />}
                    label="Session"
                    value={formatUptime(metrics.sessionUptimeSec)}
                    showBar={false}
                />
                <MetricBar
                    icon={<Cpu size={15} />}
                    label="CPU cores"
                    value={metrics.cpuCores !== null ? String(metrics.cpuCores) : "—"}
                    showBar={false}
                />
                <MetricBar
                    icon={<HardDrive size={15} />}
                    label="Local storage"
                    value={String(metrics.storageKb)}
                    unit="KB"
                    pct={Math.min(100, Math.round(metrics.storageKb / 50))}
                />
            </div>

            <p className={styles.hint}>
                Live metrics from your browser — <code>render load</code> reflects 3D scene + page performance.
                {metrics.pageLoadMs !== null && (
                    <> Page loaded in <code>{metrics.pageLoadMs}ms</code>.</>
                )}
            </p>
        </section>
    );
}
