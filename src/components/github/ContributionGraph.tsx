"use client";

import { useEffect, useState } from "react";
import {
    fetchContributions,
    generateGitHubInsights,
    getContributionWeeks,
    GITHUB_PACMAN,
    type ContributionData,
} from "@/lib/github-contribs";
import styles from "./ContributionGraph.module.css";

const USERNAME = "im-rihan";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function ContributionPacman() {
    return (
        <div className={`glass-card ${styles.arcade}`}>
            <div className={styles.arcadeBar}>
                <div className={styles.arcadeTitle}>
                    <span className={styles.arcadePips} aria-hidden>
                        <span className={styles.pipYellow} />
                        <span className={styles.pipPink} />
                        <span className={styles.pipCyan} />
                    </span>
                    <h2>Pac-Man chart</h2>
                </div>
                <span>Last 12 months · public commits · updates daily</span>
            </div>
            <div className={styles.arcadeStage}>
                {/* Theme via html.light / html.dark — avoids hydration mismatch */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={GITHUB_PACMAN.dark}
                    alt={`${USERNAME} Pac-Man contribution chart`}
                    className={`${styles.arcadeImg} ${styles.arcadeDark}`}
                    width={1166}
                    height={184}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={GITHUB_PACMAN.light}
                    alt=""
                    aria-hidden
                    className={`${styles.arcadeImg} ${styles.arcadeLight}`}
                    width={1166}
                    height={184}
                />
            </div>
            <p className={styles.fallbackNote}>
                Generated with{" "}
                <a
                    href="https://github.com/abozanona/pacman-contribution-graph"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="pointer"
                >
                    pacman-contribution-graph
                </a>
                . Source SVGs live on the profile{" "}
                <a
                    href="https://github.com/im-rihan/im-rihan/tree/output"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="pointer"
                >
                    output
                </a>{" "}
                branch.
            </p>
        </div>
    );
}

function StatsStrip({ data }: { data: ContributionData }) {
    const weeks = getContributionWeeks(data);
    const activeDays = data.contributions.filter((d) => d.count > 0).length;
    const maxDay = [...data.contributions].sort((a, b) => b.count - a.count)[0];

    const items = [
        { label: "Contributions", value: data.totalContributions.toLocaleString() },
        { label: "Weeks", value: String(weeks.length) },
        { label: "Active days", value: String(activeDays) },
        { label: "Peak day", value: maxDay?.count ? String(maxDay.count) : "—" },
    ];

    return (
        <div className={`glass-card ${styles.statsStrip}`} aria-label="Contribution stats">
            {items.map((item) => (
                <div key={item.label} className={styles.statItem}>
                    <span className={styles.statValue}>{item.value}</span>
                    <span className={styles.statLabel}>{item.label}</span>
                </div>
            ))}
        </div>
    );
}

export function ContributionGraph() {
    const [data, setData] = useState<ContributionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        fetchContributions(USERNAME).then((d) => {
            if (cancelled) return;
            setData(d);
            setLoading(false);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const weeks = data ? getContributionWeeks(data) : [];
    const insights = data ? generateGitHubInsights(data) : [];

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
            <ContributionPacman />
            {data ? <StatsStrip data={data} /> : null}
            {loading ? <div className={styles.loading}>Loading heatmap…</div> : null}
            {!loading && !data ? (
                <div className={`glass-card ${styles.graphCard}`}>
                    <div className={styles.header}>
                        <h2>Contribution Graph</h2>
                        <span>Full year · GitHub</span>
                    </div>
                    <div className={styles.errorBox}>
                        <p>
                            The live contribution API is temporarily unavailable. The Pac-Man chart above still
                            reflects recent public activity.
                        </p>
                        <a
                            href={`https://github.com/${USERNAME}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            data-cursor="pointer"
                        >
                            Open GitHub profile →
                        </a>
                    </div>
                </div>
            ) : null}
            {data ? (
            <>
            <div className={`glass-card ${styles.graphCard}`}>
                <div className={styles.header}>
                    <h2>Contribution Graph</h2>
                    <span>
                        {data.totalContributions.toLocaleString()} contributions · {data.yearLabel} ·{" "}
                        {weeks.length} weeks
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
                <h3>Activity insights</h3>
                <ul>
                    {insights.map((tip) => (
                        <li key={tip.slice(0, 40)}>{tip}</li>
                    ))}
                </ul>
            </div>
            </>
            ) : null}
        </div>
    );
}
