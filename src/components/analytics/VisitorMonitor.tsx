"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
    Globe,
    Monitor,
    Smartphone,
    Tablet,
    MapPin,
    RefreshCw,
    Users,
    Flag,
    Activity,
    TrendingUp,
    Clock,
} from "lucide-react";
import {
    formatVisitGeo,
    getVisitorStats,
    isUnknownCountryCode,
    UNRESOLVED_COUNTRY_NAME,
    VISITOR_UPDATE_EVENT,
    type VisitorStats,
} from "@/lib/visitor-analytics";
import { countryFlagSrc, countryFlagEmoji } from "@/lib/country-flag";
import { getCountryCoords, hasCountryCoords } from "@/data/country-coordinates";
import { aggregateByField, formatVisitTime, normalizePagePath, topCountryShare } from "@/lib/analytics-insights";
import { useAnimatedNumber } from "@/lib/use-animated-number";
import styles from "./VisitorMonitor.module.css";

const WORLD_MAP_SRC = "/world-map.png";
const HOME_HUB_CODE = "IN";
const MAX_SPOKES = 6;

interface MapPoint {
    xPct: number;
    yPct: number;
    svgX: number;
    svgY: number;
}

function projectMapPoint(lon: number, lat: number): MapPoint {
    const xPct = ((lon + 180) / 360) * 100;
    const yPct = ((90 - lat) / 180) * 100;
    return { xPct, yPct, svgX: xPct, svgY: yPct / 2 };
}

function mapArcPath(x1: number, y1: number, x2: number, y2: number): string {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const mx = (x1 + x2) / 2;
    const bulge = Math.min(12, 4 + dist * 0.12);
    const my = Math.max(1, Math.min(49, Math.min(y1, y2) - bulge - dx * 0.03));
    return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
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

function FlatWorldMap({ countries }: { countries: VisitorStats["countries"] }) {
    const mappable = useMemo(
        () => countries.filter((c) => hasCountryCoords(c.code)),
        [countries],
    );
    const unknownCount = useMemo(
        () => countries.filter((c) => !hasCountryCoords(c.code)).reduce((s, c) => s + c.count, 0),
        [countries],
    );
    const totalHits = countries.reduce((s, c) => s + c.count, 0);
    const max = Math.max(...mappable.map((c) => c.count), 1);

    const { pins, arcs, hubCode } = useMemo(() => {
        const mapped = mappable.map((c) => {
            const [lon, lat] = getCountryCoords(c.code);
            const pt = projectMapPoint(lon, lat);
            const scale = 0.88 + (c.count / max) * 0.42;
            return { ...c, ...pt, scale };
        });

        if (mapped.length === 0) {
            return { pins: [], arcs: [] as string[], hubCode: null as string | null };
        }

        const hub = mapped.find((p) => p.code === HOME_HUB_CODE) ?? mapped[0];
        const hubCode = hub.code;
        const pins = mapped.map((p) => ({ ...p, isHub: p.code === hubCode }));
        const spokes = mapped.filter((p) => p.code !== hubCode).slice(0, MAX_SPOKES);
        const arcs = spokes.map((s) => mapArcPath(hub.svgX, hub.svgY, s.svgX, s.svgY));

        return { pins, arcs, hubCode };
    }, [mappable, max]);

    return (
        <div className={styles.mapWrap} aria-label="Visitor world map">
            <div className={styles.mapFrame} aria-hidden />
            <div className={styles.mapGrid} aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={WORLD_MAP_SRC} alt="" className={styles.mapGeo} aria-hidden />
            <div className={styles.mapOcean} aria-hidden />
            <div className={styles.mapShine} aria-hidden />
            <svg className={styles.mapArcs} viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden>
                {arcs.map((d, i) => (
                    <path key={i} d={d} className={styles.mapArc} />
                ))}
            </svg>
            <div className={styles.mapHud}>
                <span className={styles.mapLive}>
                    <span className={styles.mapLiveDot} aria-hidden />
                    Live geo feed
                </span>
                <span className={styles.mapStat}>
                    {mappable.length} region{mappable.length !== 1 ? "s" : ""}
                </span>
                <span className={styles.mapStat}>{totalHits} sessions</span>
                {unknownCount > 0 && (
                    <span className={styles.mapStat}>{unknownCount} unresolved</span>
                )}
                {hubCode && pins.length > 1 && (
                    <span className={styles.mapStat}>Hub · {hubCode}</span>
                )}
            </div>
            <div className={styles.mapPins}>
                {pins.map((c, i) => (
                    <div
                        key={c.code}
                        className={`${styles.mapPin} ${c.isHub ? styles.mapPinHub : ""}`}
                        style={{
                            left: `${c.xPct}%`,
                            top: `${c.yPct}%`,
                            "--pin-scale": c.scale,
                            "--pin-delay": `${i * 0.35}s`,
                        } as React.CSSProperties}
                        title={`${c.name}: ${c.count} visit${c.count !== 1 ? "s" : ""}${c.isHub ? " (hub)" : ""}`}
                    >
                        <div className={styles.mapPinAnchor}>
                            <span className={styles.mapPinDot} aria-hidden />
                            <span className={styles.mapPinRing} aria-hidden />
                            <span className={styles.mapPinGlow} aria-hidden />
                            <CountryFlag code={c.code} size="lg" className={styles.mapPinFlag} title={c.name} />
                            <span className={styles.mapPinMeta}>
                                <span className={styles.mapPinCode}>{c.code}</span>
                                <span className={styles.mapPinCount}>{c.count}</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.mapVignette} aria-hidden />
        </div>
    );
}

function deviceIcon(type: string) {
    if (type === "mobile") return <Smartphone size={16} />;
    if (type === "tablet") return <Tablet size={16} />;
    return <Monitor size={16} />;
}

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
        // Initial async data fetch on mount — setState inside `load` fires only
        // after the async work completes, so it is not a synchronous cascade.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
        const onUpdate = () => load(true);
        window.addEventListener(VISITOR_UPDATE_EVENT, onUpdate);
        return () => window.removeEventListener(VISITOR_UPDATE_EVENT, onUpdate);
    }, [load]);

    // Hooks must run unconditionally, before the loading/empty early returns below.
    const animatedTotal = useAnimatedNumber(stats?.total ?? 0);
    const animatedGlobal = useAnimatedNumber(stats?.globalTotal ?? stats?.total ?? 0);
    const animatedCountries = useAnimatedNumber(stats?.countries.length ?? 0);
    const animatedRecent = useAnimatedNumber(stats?.recent.length ?? 0);

    if (loading && !stats) {
        return (
            <div className={`glass-card ${styles.card}`}>
                <p className={styles.loading}>Loading visitor analytics...</p>
            </div>
        );
    }

    if (!stats) return null;

    const topDevice = stats.devices[0]?.label ?? "—";
    const isDemo = stats.isDemo || stats.source === "demo";
    const supabase = stats.supabase;
    const showBackendStatus = isAnalyticsDebugMode();
    const topShare = topCountryShare(stats.countries, stats.total);
    const topCountry = stats.countries[0]?.name ?? "—";
    const browsers = aggregateByField(stats.recent, "browser").slice(0, 5);
    const pages = aggregateByField(stats.recent, "page").slice(0, 5);
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
                        <span className={styles.metricNum}>{Math.round(animatedTotal)}</span>
                        <span className={styles.metricLabel}>Total visits</span>
                    </div>
                </div>
                <div className={`glass-card ${styles.metric}`}>
                    <Globe size={20} />
                    <div>
                        <span className={styles.metricNum}>
                            {stats.globalTotal !== null ? Math.round(animatedGlobal) : "—"}
                        </span>
                        <span className={styles.metricLabel}>
                            {stats.globalTotal !== null ? "Global reach" : "Global counter unavailable"}
                        </span>
                    </div>
                </div>
                <div className={`glass-card ${styles.metric}`}>
                    <Flag size={20} />
                    <div>
                        <span className={styles.metricNum}>{Math.round(animatedCountries)}</span>
                        <span className={styles.metricLabel}>Countries</span>
                    </div>
                </div>
                <div className={`glass-card ${styles.metric}`}>
                    <TrendingUp size={20} />
                    <div>
                        <span className={styles.metricNum}>{topShare ? `${topShare}%` : "—"}</span>
                        <span className={styles.metricLabel}>Top: {topCountry.split(" ")[0]}</span>
                    </div>
                </div>
                <div className={`glass-card ${styles.metric}`}>
                    <Monitor size={20} />
                    <div>
                        <span className={styles.metricNum}>{topDevice.split("·")[0]?.trim() ?? "—"}</span>
                        <span className={styles.metricLabel}>Top device</span>
                    </div>
                </div>
                <div className={`glass-card ${styles.metric}`}>
                    <Activity size={20} />
                    <div>
                        <span className={styles.metricNum}>{Math.round(animatedRecent)}</span>
                        <span className={styles.metricLabel}>Recent sessions</span>
                    </div>
                </div>
            </div>

            <div className={`glass-card ${styles.card}`}>
                <div className={styles.cardGlow} aria-hidden />
                <span className={`${styles.cardCorner} ${styles.cardCornerTl}`} aria-hidden />
                <span className={`${styles.cardCorner} ${styles.cardCornerTr}`} aria-hidden />
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
                            You: <strong>{formatVisitGeo(stats.current)}</strong>
                            {" · "}{stats.current.deviceLabel} · {stats.current.browser}
                        </span>
                    </div>
                )}

                {stats.countries.some((c) => hasCountryCoords(c.code)) ? (
                    <FlatWorldMap countries={stats.countries} />
                ) : (
                    <div className={styles.emptyMap}>
                        Browse the site once — your location will appear on the map with country flags and counts.
                    </div>
                )}

                {stats.countries.some((c) => hasCountryCoords(c.code)) && (
                    <div className={styles.shareBars}>
                        {stats.countries.filter((c) => hasCountryCoords(c.code)).slice(0, 5).map((c) => {
                            const pct = Math.round((c.count / stats.total) * 100);
                            return (
                                <div key={c.code} className={styles.shareRow}>
                                    <CountryFlag code={c.code} size="sm" title={c.name} />
                                    <span className={styles.shareLabel}>{c.name}</span>
                                    <div className={styles.shareTrack} aria-hidden>
                                        <span className={styles.shareFill} style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className={styles.sharePct}>{pct}%</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className={styles.panels}>
                    <div className={`${styles.panel} glass-card`}>
                        <h3>By country</h3>
                        <ul>
                            {stats.countries.length === 0 && <li className={styles.muted}>No data yet</li>}
                            {stats.countries.map((c) => {
                                const unresolved = isUnknownCountryCode(c.code);
                                const [lon, lat] = unresolved ? [0, 0] : getCountryCoords(c.code);
                                return (
                                    <li key={c.code}>
                                        <span className={styles.countryRow}>
                                            <CountryFlag code={c.code} size="md" className={styles.countryFlag} title={c.name} />
                                            <span>
                                                <strong>{c.name}</strong>
                                                <span className={styles.coords}>
                                                    {unresolved ? "Geo lookup failed" : `${lat.toFixed(1)}°, ${lon.toFixed(1)}°`}
                                                </span>
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
                    <div className={`${styles.panel} glass-card`}>
                        <h3>Top browsers</h3>
                        <ul>
                            {browsers.length === 0 && <li className={styles.muted}>No recent sessions</li>}
                            {browsers.map((b) => (
                                <li key={b.label}>
                                    <span>{b.label}</span>
                                    <span className={styles.count}>{b.count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={`${styles.panel} glass-card`}>
                        <h3>Top pages</h3>
                        <ul>
                            {pages.length === 0 && <li className={styles.muted}>No recent sessions</li>}
                            {pages.map((p) => (
                                <li key={p.label}>
                                    <span className={styles.pagePath}>{p.label}</span>
                                    <span className={styles.count}>{p.count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {stats.recent.length > 0 && (
                    <div className={`${styles.recentCard} glass-card`}>
                        <h3>
                            <Clock size={16} />
                            Recent activity
                        </h3>
                        <ul className={styles.recentList}>
                            {stats.recent.slice(0, 8).map((v) => (
                                <li key={v.id}>
                                    <CountryFlag
                                        code={v.countryCode}
                                        size="sm"
                                        title={isUnknownCountryCode(v.countryCode) ? UNRESOLVED_COUNTRY_NAME : v.countryName}
                                    />
                                    <div className={styles.recentBody}>
                                        <strong>{formatVisitGeo(v)}</strong>
                                        <span>
                                            {normalizePagePath(v.page)} · {v.browser} · {v.deviceLabel}
                                        </span>
                                    </div>
                                    <span className={styles.recentTime}>{formatVisitTime(v.timestamp)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
