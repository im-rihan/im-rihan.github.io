export interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

export interface ContributionData {
    contributions: ContributionDay[];
    totalContributions: number;
}

export async function fetchContributions(username: string): Promise<ContributionData | null> {
    try {
        const res = await fetch(
            `https://github-contributions-api.deno.dev/${username}.json`,
            { cache: "no-store" }
        );
        if (!res.ok) return null;
        const data = await res.json();
        const contributions: ContributionDay[] = (data.contributions ?? []).map(
            (d: { date: string; count: number; intensity: number }) => ({
                date: d.date,
                count: d.count,
                level: d.intensity ?? (d.count === 0 ? 0 : Math.min(4, Math.ceil(d.count / 3))),
            })
        );
        const totalContributions =
            data.totalContributions ??
            contributions.reduce((sum, d) => sum + d.count, 0);
        return { contributions, totalContributions };
    } catch {
        return null;
    }
}

export function generateGitHubInsights(data: ContributionData): string[] {
    const insights: string[] = [];
    const recent = data.contributions.slice(-30);
    const recentTotal = recent.reduce((s, d) => s + d.count, 0);
    const last7 = data.contributions.slice(-7).reduce((s, d) => s + d.count, 0);

    insights.push(`Total contributions tracked: ${data.totalContributions.toLocaleString()}.`);

    if (last7 >= 10) {
        insights.push("Strong recent activity — keep the momentum going with consistent commits.");
    } else if (last7 >= 1) {
        insights.push("Light activity this week. A small PR or documentation update would boost your graph.");
    } else {
        insights.push("No recent commits detected. Consider pushing a side project or open-source contribution.");
    }

    if (recentTotal >= 50) {
        insights.push("Excellent monthly rhythm — your profile shows sustained engineering discipline.");
    } else if (recentTotal >= 15) {
        insights.push("Steady contributor. Pairing feature work with README or test commits strengthens your public profile.");
    } else {
        insights.push("Opportunity to increase visibility: even 2–3 commits per week improves recruiter-facing signals.");
    }

    const maxDay = [...data.contributions].sort((a, b) => b.count - a.count)[0];
    if (maxDay && maxDay.count > 0) {
        insights.push(`Peak day: ${maxDay.date} with ${maxDay.count} contributions — great sprint energy.`);
    }

    return insights;
}
