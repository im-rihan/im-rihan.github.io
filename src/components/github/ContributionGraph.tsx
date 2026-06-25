"use client";

import { useEffect, useState } from "react";
import { fetchContributions, generateGitHubInsights, type ContributionData } from "@/lib/github-contribs";
import styles from "./ContributionGraph.module.css";

const USERNAME = "im-rihan";

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
        return <div className={styles.loading}>Loading contribution data...</div>;
    }

    if (!data) {
        return (
            <div className={`glass-card ${styles.error}`}>
                Could not load GitHub contributions. Visit{" "}
                <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noopener noreferrer">
                    github.com/{USERNAME}
                </a>
            </div>
        );
    }

    const weeks: ContributionData["contributions"][] = [];
    for (let i = 0; i < data.contributions.length; i += 7) {
        weeks.push(data.contributions.slice(i, i + 7));
    }

    const insights = generateGitHubInsights(data);

    return (
        <div className={styles.wrapper}>
            <div className={`glass-card ${styles.graphCard}`}>
                <div className={styles.header}>
                    <h2>Contribution Graph</h2>
                    <span>{data.totalContributions.toLocaleString()} contributions</span>
                </div>
                <div className={styles.grid}>
                    {weeks.map((week, wi) => (
                        <div key={wi} className={styles.week}>
                            {week.map((day) => (
                                <div
                                    key={day.date}
                                    className={`${styles.cell} ${styles[`l${Math.min(day.level, 4)}`]}`}
                                    title={`${day.date}: ${day.count} contributions`}
                                />
                            ))}
                        </div>
                    ))}
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
