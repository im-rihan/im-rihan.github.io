"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Database,
    ExternalLink,
    HelpCircle,
    RefreshCw,
    Server,
    Shield,
    XCircle,
    Zap,
} from "lucide-react";
import { statusGroupLabels, statusTargets, type StatusGroup } from "@/data/status-targets";
import { portfolioStats, skillGroups } from "@/data/profile";
import { VisitorMonitor } from "@/components/analytics/VisitorMonitor";
import { SystemMetrics } from "@/components/analytics/SystemMetrics";
import { WebVitalsPanel } from "@/components/analytics/WebVitalsPanel";
import {
    checkAllLinks,
    computeOverallHealth,
    type OverallHealth,
    type StatusResult,
} from "@/lib/status-check";
import {
    computeLinkUptime,
    formatRelativeTime,
    linkUptimeSparkline,
    readStatusHistory,
    type StatusHistoryEntry,
} from "@/lib/status-history";
import { probeSupabase, type SupabaseProbeResult } from "@/lib/visitor-analytics";
import styles from "./StatusDashboard.module.css";

const siteStack = [
    { label: "Framework", value: "Next.js 16 · static export" },
    { label: "Hosting", value: "GitHub Pages" },
    { label: "Analytics", value: "Supabase + local geo" },
    { label: "3D", value: "React Three Fiber" },
    { label: "Monitoring", value: "Client-side link probes" },
];

const FILTER_GROUPS: (StatusGroup | "all")[] = ["all", "page", "case-study", "asset", "seo", "external"];

function StatusIcon({ status }: { status: StatusResult["status"] }) {
    if (status === "online") return <CheckCircle2 size={12} />;
    if (status === "slow") return <AlertTriangle size={12} />;
    if (status === "offline") return <XCircle size={12} />;
    return <HelpCircle size={12} />;
}

function OverallBanner({ health, online, total }: { health: OverallHealth; online: number; total: number }) {
    const copy =
        health === "operational"
            ? "All monitored endpoints are responding normally."
            : health === "degraded"
              ? "Some endpoints are slow or could not be fully verified."
              : "One or more endpoints are unreachable.";

    return (
        <div className={`${styles.banner} ${styles[`banner_${health}`]}`} role="status">
            {health === "operational" && <CheckCircle2 size={22} aria-hidden />}
            {health === "degraded" && <AlertTriangle size={22} aria-hidden />}
            {health === "outage" && <XCircle size={22} aria-hidden />}
            <div>
                <strong>
                    {health === "operational"
                        ? "All systems operational"
                        : health === "degraded"
                          ? "Partial degradation"
                          : "Service issues detected"}
                </strong>
                <p>
                    {online}/{total} endpoints online · {copy}
                </p>
            </div>
        </div>
    );
}

function Sparkline({ values }: { values: number[] }) {
    if (values.length === 0) return <span className={styles.sparkEmpty}>—</span>;
    return (
        <span className={styles.sparkline} aria-hidden>
            {values.map((v, i) => (
                <span
                    key={i}
                    className={`${styles.sparkBar} ${v >= 1 ? styles.sparkUp : v <= 0 ? styles.sparkDown : styles.sparkMid}`}
                />
            ))}
        </span>
    );
}

function LinkRowSkeleton() {
    return (
        <li className={styles.skeletonRow} aria-hidden>
            <div className={styles.skeletonLine} style={{ width: "42%" }} />
            <div className={styles.skeletonLine} style={{ width: "28%" }} />
        </li>
    );
}

function ServiceCard({
    title,
    icon,
    status,
    detail,
    tone,
}: {
    title: string;
    icon: ReactNode;
    status: string;
    detail: string;
    tone: "ok" | "warn" | "muted";
}) {
    return (
        <div className={`glass-card ${styles.serviceCard} ${styles[`service_${tone}`]}`}>
            <div className={styles.serviceHead}>
                {icon}
                <span>{title}</span>
            </div>
            <strong className={styles.serviceStatus}>{status}</strong>
            <p className={styles.serviceDetail}>{detail}</p>
        </div>
    );
}

export function StatusDashboard() {
    const [links, setLinks] = useState<StatusResult[]>([]);
    const [checking, setChecking] = useState(true);
    const [filter, setFilter] = useState<StatusGroup | "all">("all");
    const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
    const [supabase, setSupabase] = useState<SupabaseProbeResult | null>(null);
    const [lastChecked, setLastChecked] = useState<number | null>(null);

    const runChecks = useCallback(async () => {
        setChecking(true);
        try {
            const [results, sb] = await Promise.all([checkAllLinks(statusTargets), probeSupabase()]);
            setLinks(results);
            setSupabase(sb);
            setHistory(readStatusHistory());
            setLastChecked(Date.now());
        } finally {
            setChecking(false);
        }
    }, []);

    useEffect(() => {
        // `runChecks` is an async callback that calls setState internally.
        // Intentional — triggers the initial link-health probe run on mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        runChecks();
    }, [runChecks]);

    const totalSkills = skillGroups.reduce((s, g) => s + g.tags.length, 0);
    const filtered = useMemo(
        () => (filter === "all" ? links : links.filter((l) => l.group === filter)),
        [links, filter],
    );

    const online = links.filter((l) => l.status === "online").length;
    const slow = links.filter((l) => l.status === "slow").length;
    const offline = links.filter((l) => l.status === "offline").length;
    const unknown = links.filter((l) => l.status === "unknown").length;
    const avgMs =
        links.filter((l) => l.responseMs !== null).length > 0
            ? Math.round(
                  links.filter((l) => l.responseMs !== null).reduce((s, l) => s + (l.responseMs ?? 0), 0) /
                      links.filter((l) => l.responseMs !== null).length,
              )
            : null;

    const overall = links.length > 0 ? computeOverallHealth(links) : "operational";
    const plausibleConfigured = Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim());

    const groupCounts = useMemo(() => {
        const counts: Partial<Record<StatusGroup | "all", number>> = { all: links.length };
        for (const link of links) {
            counts[link.group] = (counts[link.group] ?? 0) + 1;
        }
        return counts;
    }, [links]);

    return (
        <div className={styles.wrapper}>
            <SystemMetrics networkLatencyMs={avgMs} />
            <WebVitalsPanel />
            <VisitorMonitor />

            {!checking && links.length > 0 && (
                <OverallBanner health={overall} online={online} total={links.length} />
            )}

            <div className={styles.servicesRow}>
                <ServiceCard
                    title="GitHub Pages"
                    icon={<Server size={18} />}
                    status={checking ? "Checking…" : overall === "outage" ? "Issues" : "Live"}
                    detail={`Static export · ${statusTargets.filter((t) => t.type === "internal").length} internal routes monitored`}
                    tone={checking ? "muted" : overall === "outage" ? "warn" : "ok"}
                />
                <ServiceCard
                    title="Supabase Analytics"
                    icon={<Database size={18} />}
                    status={
                        checking
                            ? "Checking…"
                            : !supabase?.configured
                              ? "Not configured"
                              : supabase.ok
                                ? "Connected"
                                : "Error"
                    }
                    detail={supabase?.message ?? "Visitor sync backend"}
                    tone={
                        checking || !supabase
                            ? "muted"
                            : !supabase.configured
                              ? "muted"
                              : supabase.ok
                                ? "ok"
                                : "warn"
                    }
                />
                <ServiceCard
                    title="Plausible"
                    icon={<Shield size={18} />}
                    status={plausibleConfigured ? "Enabled" : "Disabled"}
                    detail={
                        plausibleConfigured
                            ? `Tracking ${process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}`
                            : "Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN to enable"
                    }
                    tone={plausibleConfigured ? "ok" : "muted"}
                />
            </div>

            <div className={styles.row}>
                <div className={`glass-card ${styles.statsCard}`}>
                    <h2>Portfolio Stats</h2>
                    <div className={styles.statsGrid}>
                        <div className={styles.stat}>
                            <span className={styles.num}>{portfolioStats.certifications}</span>
                            <span>Certifications</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.num}>{portfolioStats.yearsExperience}</span>
                            <span>Years Experience</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.num}>{portfolioStats.projects}+</span>
                            <span>Projects</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.num}>{totalSkills}</span>
                            <span>Skills Listed</span>
                        </div>
                    </div>
                    <p className={styles.buildNote}>
                        {links.length} endpoints monitored · history stored locally in your browser
                    </p>
                </div>

                <div className={`glass-card ${styles.stackCard}`}>
                    <h2>
                        <Server size={18} />
                        Site Stack
                    </h2>
                    <ul className={styles.stackList}>
                        {siteStack.map((item) => (
                            <li key={item.label}>
                                <span className={styles.stackLabel}>{item.label}</span>
                                <span className={styles.stackValue}>{item.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {!checking && links.length > 0 && (
                <div className={styles.healthSummary}>
                    <div className={`glass-card ${styles.healthTile} ${styles.healthOk}`}>
                        <CheckCircle2 size={20} />
                        <span className={styles.healthNum}>{online}</span>
                        <span>Online</span>
                    </div>
                    <div className={`glass-card ${styles.healthTile} ${styles.healthWarn}`}>
                        <AlertTriangle size={20} />
                        <span className={styles.healthNum}>{slow}</span>
                        <span>Slow</span>
                    </div>
                    <div className={`glass-card ${styles.healthTile} ${styles.healthBad}`}>
                        <XCircle size={20} />
                        <span className={styles.healthNum}>{offline}</span>
                        <span>Offline</span>
                    </div>
                    <div className={`glass-card ${styles.healthTile}`}>
                        <HelpCircle size={20} />
                        <span className={styles.healthNum}>{unknown}</span>
                        <span>Unverified</span>
                    </div>
                    <div className={`glass-card ${styles.healthTile}`}>
                        <Zap size={20} />
                        <span className={styles.healthNum}>{avgMs !== null ? `${avgMs}ms` : "—"}</span>
                        <span>Avg response</span>
                    </div>
                </div>
            )}

            <div className={`glass-card ${styles.linksCard}`}>
                <div className={styles.linksHeader}>
                    <div>
                        <h2>Link Health</h2>
                        {lastChecked && (
                            <p className={styles.lastChecked}>
                                <Clock size={14} aria-hidden />
                                Last checked {formatRelativeTime(lastChecked)}
                                {history.length > 0 && ` · ${history.length} runs in history`}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        className={styles.refreshBtn}
                        onClick={runChecks}
                        disabled={checking}
                        aria-label="Re-run link health checks"
                        data-cursor="pointer"
                    >
                        <RefreshCw size={16} className={checking ? styles.spinning : undefined} />
                        {checking ? "Checking…" : "Re-run checks"}
                    </button>
                </div>

                <div className={styles.filters} role="tablist" aria-label="Filter endpoints">
                    {FILTER_GROUPS.map((group) => (
                        <button
                            key={group}
                            type="button"
                            role="tab"
                            aria-selected={filter === group}
                            className={`${styles.filterChip} ${filter === group ? styles.filterActive : ""}`}
                            onClick={() => setFilter(group)}
                        >
                            {statusGroupLabels[group]}
                            {groupCounts[group] !== undefined && (
                                <span className={styles.filterCount}>{groupCounts[group]}</span>
                            )}
                        </button>
                    ))}
                </div>

                {checking ? (
                    <ul className={styles.linkList} aria-busy="true" aria-label="Loading endpoint checks">
                        {Array.from({ length: 8 }, (_, i) => (
                            <LinkRowSkeleton key={i} />
                        ))}
                    </ul>
                ) : (
                    <ul className={styles.linkList}>
                        {filtered.length === 0 && (
                            <li className={styles.emptyFilter}>No endpoints in this category.</li>
                        )}
                        {filtered.map((link) => {
                            const uptime = computeLinkUptime(link.name, history);
                            const spark = linkUptimeSparkline(link.name, history);
                            const latencyPct =
                                link.responseMs !== null
                                    ? Math.min(100, Math.round((link.responseMs / 2000) * 100))
                                    : null;

                            return (
                                <li key={link.name}>
                                    <div className={styles.linkInfo}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            data-cursor="pointer"
                                        >
                                            {link.name}
                                            <ExternalLink size={12} className={styles.extIcon} aria-hidden />
                                        </a>
                                        <span className={styles.groupTag}>{statusGroupLabels[link.group]}</span>
                                        {link.note && <span className={styles.note}>{link.note}</span>}
                                        {latencyPct !== null && (
                                            <div className={styles.latencyTrack} aria-hidden>
                                                <span
                                                    className={`${styles.latencyFill} ${
                                                        link.status === "slow"
                                                            ? styles.latencySlow
                                                            : link.status === "offline"
                                                              ? styles.latencyBad
                                                              : ""
                                                    }`}
                                                    style={{ width: `${latencyPct}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.linkMeta}>
                                        <div className={styles.uptimeCol} title="Recent check history">
                                            <Sparkline values={spark} />
                                            {uptime !== null && (
                                                <span className={styles.uptimePct}>{uptime}% up</span>
                                            )}
                                        </div>
                                        <span className={`${styles.badge} ${styles[link.status]}`}>
                                            <StatusIcon status={link.status} />
                                            {link.status}
                                        </span>
                                        {link.responseMs !== null && (
                                            <span className={styles.ms}>{link.responseMs}ms</span>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
