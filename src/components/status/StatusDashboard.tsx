"use client";

import { useEffect, useState } from "react";
import { statusTargets } from "@/data/status-targets";
import { portfolioStats, skillGroups } from "@/data/profile";
import { VisitorMonitor } from "@/components/analytics/VisitorMonitor";
import { checkAllLinks, type StatusResult } from "@/lib/status-check";
import styles from "./StatusDashboard.module.css";

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

    return (
        <div className={styles.wrapper}>
            <VisitorMonitor />

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
