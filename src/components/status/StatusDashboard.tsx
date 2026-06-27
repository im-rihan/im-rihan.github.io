"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, Server, Zap } from "lucide-react";
import { statusTargets } from "@/data/status-targets";
import { portfolioStats, skillGroups } from "@/data/profile";
import { VisitorMonitor } from "@/components/analytics/VisitorMonitor";
import { SystemMetrics } from "@/components/analytics/SystemMetrics";
import { checkAllLinks, type StatusResult } from "@/lib/status-check";
import styles from "./StatusDashboard.module.css";

const siteStack = [
    { label: "Framework", value: "Next.js 16 · static export" },
    { label: "Hosting", value: "GitHub Pages" },
    { label: "Analytics", value: "Supabase + local geo" },
    { label: "3D", value: "React Three Fiber" },
];

export function StatusDashboard() {
    const [links, setLinks] = useState<StatusResult[]>([]);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        checkAllLinks(statusTargets).then((results) => {
            setLinks(results);
            setChecking(false);
        });
    }, []);

    const totalSkills = skillGroups.reduce((s, g) => s + g.tags.length, 0);
    const online = links.filter((l) => l.status === "online").length;
    const slow = links.filter((l) => l.status === "slow").length;
    const offline = links.filter((l) => l.status === "offline" || l.status === "unknown").length;
    const avgMs =
        links.filter((l) => l.responseMs !== null).length > 0
            ? Math.round(
                  links.filter((l) => l.responseMs !== null).reduce((s, l) => s + (l.responseMs ?? 0), 0) /
                      links.filter((l) => l.responseMs !== null).length
              )
            : null;

    return (
        <div className={styles.wrapper}>
            <SystemMetrics networkLatencyMs={avgMs} />
            <VisitorMonitor />

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
                        Site built with Next.js · Static export for GitHub Pages
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
                        <span>Issues</span>
                    </div>
                    <div className={`glass-card ${styles.healthTile}`}>
                        <Zap size={20} />
                        <span className={styles.healthNum}>{avgMs !== null ? `${avgMs}ms` : "—"}</span>
                        <span>Avg response</span>
                    </div>
                </div>
            )}

            <div className={`glass-card ${styles.linksCard}`}>
                <h2>Link Health</h2>
                {checking ? (
                    <p className={styles.checking}>Checking endpoints...</p>
                ) : (
                    <ul className={styles.linkList}>
                        {links.map((link) => (
                            <li key={link.name}>
                                <div className={styles.linkInfo}>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                        {link.name}
                                    </a>
                                    {link.note && <span className={styles.note}>{link.note}</span>}
                                </div>
                                <div className={styles.linkMeta}>
                                    <span className={`${styles.badge} ${styles[link.status]}`}>
                                        {link.status === "online" && <CheckCircle2 size={12} />}
                                        {link.status === "slow" && <AlertTriangle size={12} />}
                                        {(link.status === "offline" || link.status === "unknown") && (
                                            <HelpCircle size={12} />
                                        )}
                                        {link.status}
                                    </span>
                                    {link.responseMs !== null && (
                                        <span className={styles.ms}>{link.responseMs}ms</span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
