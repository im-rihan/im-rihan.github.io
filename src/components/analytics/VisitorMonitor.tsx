"use client";

import { useEffect, useState, useCallback } from "react";
import { Globe, Monitor, Smartphone, Tablet, MapPin, RefreshCw, Users, Flag } from "lucide-react";
import {
    getVisitorStats,
    VISITOR_UPDATE_EVENT,
    type VisitorStats,
} from "@/lib/visitor-analytics";
import { countryFlagSrc, countryFlagEmoji } from "@/lib/country-flag";
import { getCountryCoords } from "@/data/country-coordinates";
import styles from "./VisitorMonitor.module.css";

/** Natural equirectangular landmass — ocean color comes from CSS gradient. */
const WORLD_MAP_SRC =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/1280px-World_map_blank_without_borders.svg.png";

function projectPercent(lon: number, lat: number): { left: number; top: number } {
    return {
        left: ((lon + 180) / 360) * 100,
        top: ((90 - lat) / 180) * 100,
    };
}

function CountryFlag({
    code,
    className,
    title,
    size = "md",
}: {
    code: string;
    className?: string;
    title?: string;
    size?: "sm" | "md" | "lg";
}) {
    const [failed, setFailed] = useState(false);
    const src = countryFlagSrc(code);
    const sizeClass =
        size === "sm" ? styles.flagSm : size === "lg" ? styles.flagLg : styles.flagMd;

    if (!src || failed) {
        return (
            <span
                className={`${styles.flagEmoji} ${sizeClass} ${className ?? ""}`}
                title={title}
                aria-hidden
            >
                {countryFlagEmoji(code)}
            </span>
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt=""
            className={`${styles.flagImg} ${sizeClass} ${className ?? ""}`}
            title={title}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
        />
    );
}

function WorldMap({ countries }: { countries: VisitorStats["countries"] }) {
    const max = Math.max(...countries.map((c) => c.count), 1);

    return (
        <div className={styles.mapWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={WORLD_MAP_SRC} alt="" className={styles.mapGeo} aria-hidden />
            <div className={styles.mapOcean} aria-hidden />
            <div className={styles.mapPins}>
                {countries.map((c) => {
                    const [lon, lat] = getCountryCoords(c.code);
                    const { left, top } = projectPercent(lon, lat);
                    const scale = 0.85 + (c.count / max) * 0.45;
                    return (
                        <div
                            key={c.code}
                            className={styles.mapPin}
                            style={{ left: `${left}%`, top: `${top}%`, transform: `translate(-50%, -50%) scale(${scale})` }}
                            title={`${c.name}: ${c.count} visit${c.count !== 1 ? "s" : ""}`}
                        >
                            <span className={styles.mapPinGlow} aria-hidden />
                            <CountryFlag code={c.code} size="lg" className={styles.mapPinFlag} title={c.name} />
                            <span className={styles.mapPinMeta}>
                                <span className={styles.mapPinCode}>{c.code}</span>
                                <span className={styles.mapPinCount}>{c.count}</span>
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function deviceIcon(type: string) {
    if (type === "mobile") return <Smartphone size={16} />;
    if (type === "tablet") return <Tablet size={16} />;
    return <Monitor size={16} />;
}

/** Dev-only: localhost or ?debug=1 — hide backend status banners in production. */
function isAnalyticsDebugMode(): boolean {
    if (typeof window === "undefined") return false;
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return true;
    return new URLSearchParams(window.location.search).get("debug") === "1";
}

export function VisitorMonitor() {
    const [stats, setStats] = useState<
        (VisitorStats & { source: string; isDemo?: boolean; supabase?: { ok: boolean; message: string } }) | null
    >(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async (refresh = false) => {
        setLoading(true);
        try {
            const s = await getVisitorStats(refresh);
            setStats(s);
        } catch (err) {
            console.error("[analytics] Failed to load stats:", err);
            setStats({
                total: 0,
                globalTotal: null,
                countries: [],
                devices: [],
                recent: [],
                current: null,
                source: "local",
                supabase: {
                    ok: false,
                    message: err instanceof Error ? err.message : "Failed to load analytics",
                },
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
        const onUpdate = () => load(true);
        window.addEventListener(VISITOR_UPDATE_EVENT, onUpdate);
        return () => window.removeEventListener(VISITOR_UPDATE_EVENT, onUpdate);
    }, [load]);

    if (loading && !stats) {
        return (
            <div className={`glass-card ${styles.card}`}>
                <p className={styles.loading}>Loading visitor analytics...</p>
            </div>
        );
    }

    if (!stats) return null;

    const countryCount = stats.countries.length;
    const topDevice = stats.devices[0]?.label ?? "—";
    const isDemo = stats.isDemo || stats.source === "demo";
    const supabase = stats.supabase;
    const showBackendStatus = isAnalyticsDebugMode();

    return (
        <div className={styles.wrapper}>
            {isDemo && (
                <div className={styles.demoBanner}>
                    Demo preview — sample visitor data on localhost. Add <code>?live=1</code> to see real tracking.
                </div>
            )}
            {showBackendStatus && !isDemo && supabase && !supabase.ok && (
                <div className={styles.errorBanner} role="alert">
                    <strong>Analytics backend:</strong> {supabase.message}
                </div>
            )}
            {showBackendStatus && !isDemo && supabase?.ok && (
                <div className={styles.okBanner}>
                    Supabase connected — visits sync to shared database.
                </div>
            )}
            <div className={styles.metrics}>
                <div className={`glass-card ${styles.metric}`}>
                    <Users size={20} />
                    <div>
                        <span className={styles.metricNum}>{stats.total}</span>
                        <span className={styles.metricLabel}>Total visits</span>
                    </div>
                </div>
                <div className={`glass-card ${styles.metric}`}>
                    <Flag size={20} />
                    <div>
                        <span className={styles.metricNum}>{countryCount}</span>
                        <span className={styles.metricLabel}>Countries</span>
                    </div>
                </div>
                <div className={`glass-card ${styles.metric}`}>
                    <Monitor size={20} />
                    <div>
                        <span className={styles.metricNum}>{stats.devices.length}</span>
                        <span className={styles.metricLabel}>Device types</span>
                    </div>
                </div>
                <div className={`glass-card ${styles.metric}`}>
                    <Globe size={20} />
                    <div>
                        <span className={styles.metricNum}>{topDevice.split("·")[0]?.trim() ?? "—"}</span>
                        <span className={styles.metricLabel}>Top device</span>
                    </div>
                </div>
            </div>

            <div className={`glass-card ${styles.card}`}>
                <div className={styles.header}>
                    <Globe size={22} />
                    <div className={styles.headerText}>
                        <h2>Visitor Monitor</h2>
                        <p className={styles.sub}>
                            {isDemo ? "Sample geo analytics" : "Live geo analytics"}
                            {stats.source === "merged" && " · global + local sync"}
                        </p>
                    </div>
                    <button type="button" className={styles.refresh} onClick={() => load(true)} aria-label="Refresh stats">
                        <RefreshCw size={16} />
                    </button>
                </div>

                {stats.current && (
                    <div className={styles.currentVisit}>
                        <CountryFlag code={stats.current.countryCode} size="sm" className={styles.currentFlag} title={stats.current.countryName} />
                        <MapPin size={16} />
                        <span>
                            You: <strong>{stats.current.city ? `${stats.current.city}, ` : ""}{stats.current.countryName}</strong>
                            {" · "}{stats.current.deviceLabel} · {stats.current.browser}
                        </span>
                    </div>
                )}

                {stats.countries.length > 0 ? (
                    <WorldMap countries={stats.countries} />
                ) : (
                    <div className={styles.emptyMap}>
                        Browse the site once — your location will appear on the map with country flags and counts.
                    </div>
                )}

                <div className={styles.panels}>
                    <div className={`${styles.panel} glass-card`}>
                        <h3>By country</h3>
                        <ul>
                            {stats.countries.length === 0 && <li className={styles.muted}>No data yet</li>}
                            {stats.countries.map((c) => {
                                const [lon, lat] = getCountryCoords(c.code);
                                return (
                                    <li key={c.code}>
                                        <span className={styles.countryRow}>
                                            <CountryFlag code={c.code} size="md" className={styles.countryFlag} title={c.name} />
                                            <span>
                                                <strong>{c.name}</strong>
                                                <span className={styles.coords}>{lat.toFixed(1)}°, {lon.toFixed(1)}°</span>
                                            </span>
                                        </span>
                                        <span className={styles.count}>{c.count}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className={`${styles.panel} glass-card`}>
                        <h3>By device</h3>
                        <ul>
                            {stats.devices.length === 0 && <li className={styles.muted}>No data yet</li>}
                            {stats.devices.map((d) => (
                                <li key={d.type}>
                                    <span className={styles.deviceRow}>
                                        {deviceIcon(d.type)}
                                        {d.label}
                                    </span>
                                    <span className={styles.count}>{d.count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
