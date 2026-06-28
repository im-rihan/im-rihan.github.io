"use client";

import { useEffect, useState } from "react";
import {
    fetchContributions,
    generateGitHubInsights,
    getContributionWeeks,
    type ContributionData,
} from "@/lib/github-contribs";
import styles from "./ContributionGraph.module.css";

const USERNAME = "im-rihan";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function ContributionGraph() {
    const [data, setData] = useState<ContributionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContributions(USERNAME).then((d) => {
            setData(d);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading contribution graph...</div>;
    }

    if (!data) {
        return (
            <div className={styles.wrapper}>
                <div className={`glass-card ${styles.graphCard}`}>
                    <div className={styles.header}>
                        <h2>Contribution Graph</h2>
                        <span>Full year · GitHub</span>
                    </div>
                    <div className={styles.fallbackWrap}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`https://github.com/users/${USERNAME}/contributions`}
                            alt={`${USERNAME} GitHub contributions`}
                            className={styles.fallbackImg}
                        />
                    </div>
                    <p className={styles.fallbackNote}>
                        Interactive graph unavailable — showing GitHub&apos;s full-year calendar.{" "}
                        <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noopener noreferrer">
                            View profile →
                        </a>
                    </p>
                </div>
            </div>
        );
    }

    const weeks = getContributionWeeks(data);
    const insights = generateGitHubInsights(data);

    const monthCells: { label: string; show: boolean }[] = weeks.map((week, wi) => {
        const first = week.find((d) => d.date && d.date.length === 10);
        if (!first) return { label: "", show: false };
        const month = new Date(`${first.date}T12:00:00`).getMonth();
        const prev = wi > 0 ? weeks[wi - 1] : null;
        const prevFirst = prev?.find((d) => d.date && d.date.length === 10);
        const prevMonth = prevFirst ? new Date(`${prevFirst.date}T12:00:00`).getMonth() : -1;
        return { label: MONTHS[month], show: month !== prevMonth };
    });

    return (
        <div className={styles.wrapper}>
            <div className={`glass-card ${styles.graphCard}`}>
                <div className={styles.header}>
                    <h2>Contribution Graph</h2>
                    <span>
                        {data.totalContributions.toLocaleString()} contributions · {data.yearLabel} · {weeks.length} weeks
                    </span>
                </div>
                <div className={styles.scroll}>
                    <div className={styles.graphBody}>
                        <div className={styles.monthSpacer} />
                        <div className={styles.monthRow}>
                            {monthCells.map((m, wi) => (
                                <span key={wi} className={styles.monthCell}>
                                    {m.show ? m.label : ""}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className={styles.graphBody}>
                        <div className={styles.dayLabels}>
                            {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                                <span key={i}>{d}</span>
                            ))}
                        </div>
                        <div className={styles.grid}>
                            {weeks.map((week, wi) => (
                                <div key={wi} className={styles.week}>
                                    {week.map((day, di) => (
                                        <div
                                            key={`${wi}-${di}-${day.date}`}
                                            className={`${styles.cell} ${styles[`l${Math.min(day.level, 4)}`]}`}
                                            role="img"
                                            aria-label={`${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`}
                                            title={`${day.date}: ${day.count} contribution${day.count !== 1 ? "s" : ""}`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.legend}>
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map((l) => (
                        <span key={l} className={`${styles.legendCell} ${styles[`l${l}`]}`} />
                    ))}
                    <span>More</span>
                </div>
            </div>
            <div className={`glass-card ${styles.insights}`}>
                <h3>AI-style suggestions</h3>
                <ul>
                    {insights.map((tip) => (
                        <li key={tip.slice(0, 40)}>{tip}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
