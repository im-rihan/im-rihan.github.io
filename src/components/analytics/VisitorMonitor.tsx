"use client";

import { useEffect, useState } from "react";
import { Globe, Monitor, Smartphone, Tablet, MapPin } from "lucide-react";
import { getVisitorStats, type VisitorStats } from "@/lib/visitor-analytics";
import { getCountryCoords } from "@/data/country-coordinates";
import styles from "./VisitorMonitor.module.css";

function project(lon: number, lat: number, w: number, h: number): [number, number] {
    return [((lon + 180) / 360) * w, ((90 - lat) / 180) * h];
}

function WorldMap({ countries }: { countries: VisitorStats["countries"] }) {
    const w = 720;
    const h = 360;
    const max = Math.max(...countries.map((c) => c.count), 1);

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className={styles.map} aria-label="Visitor world map">
            <defs>
                <radialGradient id="mapGlow">
                    <stop offset="0%" stopColor="rgba(20,184,166,0.35)" />
                    <stop offset="100%" stopColor="rgba(20,184,166,0)" />
                </radialGradient>
            </defs>
            {Array.from({ length: 9 }, (_, i) => (
                <line
                    key={`h${i}`}
                    x1={0}
                    y1={(h / 8) * i}
                    x2={w}
                    y2={(h / 8) * i}
                    className={styles.gridLine}
                />
            ))}
            {Array.from({ length: 13 }, (_, i) => (
                <line
                    key={`v${i}`}
                    x1={(w / 12) * i}
                    y1={0}
                    x2={(w / 12) * i}
                    y2={h}
                    className={styles.gridLine}
                />
            ))}
            {countries.map((c) => {
                const [lon, lat] = getCountryCoords(c.code);
                const [x, y] = project(lon, lat, w, h);
                const r = 6 + (c.count / max) * 14;
                return (
                    <g key={c.code}>
                        <circle cx={x} cy={y} r={r * 2} fill="url(#mapGlow)" opacity={0.6} />
                        <circle cx={x} cy={y} r={r} className={styles.marker} />
                        <title>{`${c.name}: ${c.count} visit${c.count !== 1 ? "s" : ""}`}</title>
                    </g>
                );
            })}
        </svg>
    );
}

function deviceIcon(type: string) {
    if (type === "mobile") return <Smartphone size={16} />;
    if (type === "tablet") return <Tablet size={16} />;
    return <Monitor size={16} />;
}

export function VisitorMonitor() {
    const [stats, setStats] = useState<(VisitorStats & { source: "supabase" | "local" | "global" }) | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getVisitorStats().then((s) => {
            setStats(s);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className={`glass-card ${styles.card}`}>
                <p className={styles.loading}>Loading visitor analytics...</p>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className={`glass-card ${styles.card}`}>
            <div className={styles.header}>
                <Globe size={22} />
                <div>
                    <h2>Visitor Monitor</h2>
                    <p className={styles.sub}>
                        {stats.total} total visit{stats.total !== 1 ? "s" : ""}
                        {stats.source === "global" && " · live global analytics"}
                        {stats.source === "local" && " · this browser only"}
                    </p>
                </div>
            </div>

            {stats.current && (
                <div className={styles.currentVisit}>
                    <MapPin size={16} />
                    <span>
                        Latest: <strong>{stats.current.city ? `${stats.current.city}, ` : ""}{stats.current.countryName}</strong>
                        {" · "}{stats.current.deviceLabel} · {stats.current.browser}
                    </span>
                </div>
            )}

            {stats.countries.length > 0 ? (
                <WorldMap countries={stats.countries} />
            ) : (
                <div className={styles.emptyMap}>No location data yet — visits appear after browsing the site.</div>
            )}

            <div className={styles.panels}>
                <div className={styles.panel}>
                    <h3>By country</h3>
                    <ul>
                        {stats.countries.length === 0 && <li className={styles.muted}>No data yet</li>}
                        {stats.countries.map((c) => (
                            <li key={c.code}>
                                <span>{c.name}</span>
                                <span className={styles.count}>{c.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.panel}>
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

            {stats.recent.length > 0 && (
                <div className={styles.recent}>
                    <h3>Recent visits</h3>
                    <div className={styles.recentList}>
                        {stats.recent.map((v) => (
                            <div key={v.id} className={styles.recentItem}>
                                <span>{v.countryName}{v.city ? ` · ${v.city}` : ""}</span>
                                <span className={styles.recentMeta}>
                                    {v.browser} · {new Date(v.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
