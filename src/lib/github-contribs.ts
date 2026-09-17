export interface ContributionDay {
    date: string;
    count: number;
    level: number;
}

export interface ContributionData {
    contributions: ContributionDay[];
    weeks: ContributionDay[][];
    totalContributions: number;
    yearLabel: string;
}

type ApiDay = {
    date?: string;
    contributionCount?: number;
    contributionLevel?: string;
    count?: number;
    intensity?: number;
    level?: number;
};

const CONTRIB_SOURCES = [
    (username: string) => `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    (username: string) => `https://github-contributions-api.jogruber.de/v4/${username}`,
] as const;

function levelFromCount(count: number): number {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 9) return 3;
    return 4;
}

function levelFromContributionLevel(level?: string): number {
    switch (level) {
        case "NONE":
            return 0;
        case "FIRST_QUARTILE":
            return 1;
        case "SECOND_QUARTILE":
            return 2;
        case "THIRD_QUARTILE":
            return 3;
        case "FOURTH_QUARTILE":
            return 4;
        default:
            return 0;
    }
}

function parseDay(d: ApiDay): ContributionDay {
    const count = d.contributionCount ?? d.count ?? 0;
    let level = 0;
    if (typeof d.level === "number") {
        level = d.level;
    } else if (d.contributionLevel) {
        level = levelFromContributionLevel(d.contributionLevel);
    } else if (typeof d.intensity === "number") {
        level = d.intensity;
    } else {
        level = levelFromCount(count);
    }
    return {
        date: d.date ?? "",
        count,
        level: Math.min(Math.max(level, 0), 4),
    };
}

function padWeek(week: ContributionDay[], weekIndex: number): ContributionDay[] {
    const padded = [...week];
    while (padded.length < 7) {
        padded.push({ date: `pad-w${weekIndex}-d${padded.length}`, count: 0, level: 0 });
    }
    return padded.slice(0, 7);
}

/** Keep the most recent ~371 days (53 weeks) for a full GitHub-style year view. */
function normalizeYear(days: ContributionDay[]): ContributionDay[] {
    const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
    const targetDays = 53 * 7;
    if (sorted.length <= targetDays) return sorted;
    return sorted.slice(sorted.length - targetDays);
}

function groupIntoWeeks(days: ContributionDay[]): ContributionDay[][] {
    const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
    if (sorted.length === 0) return [];

    const empty = (date: string): ContributionDay => ({ date, count: 0, level: 0 });
    const first = new Date(`${sorted[0].date}T12:00:00`);
    const dow = first.getDay();

    const flat: ContributionDay[] = [];
    for (let i = 0; i < dow; i++) {
        const d = new Date(first);
        d.setDate(d.getDate() - (dow - i));
        flat.push(empty(d.toISOString().slice(0, 10)));
    }
    flat.push(...sorted);

    const weeks: ContributionDay[][] = [];
    for (let i = 0; i < flat.length; i += 7) {
        weeks.push(padWeek(flat.slice(i, i + 7), weeks.length));
    }
    return weeks;
}

function yearRangeLabel(days: ContributionDay[]): string {
    if (days.length === 0) return "Past year";
    const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
    const first = sorted[0].date.slice(0, 7);
    const last = sorted[sorted.length - 1].date.slice(0, 7);
    return first === last ? first : `${first} – ${last}`;
}

function totalFromPayload(data: Record<string, unknown>, days: ContributionDay[]): number {
    const total = data.total;
    if (typeof total === "number") return total;
    if (total && typeof total === "object") {
        const map = total as Record<string, number>;
        if (typeof map.lastYear === "number") return map.lastYear;
        const sum = Object.values(map).reduce((acc, n) => acc + (typeof n === "number" ? n : 0), 0);
        if (sum > 0) return sum;
    }
    if (typeof data.totalContributions === "number") return data.totalContributions;
    return days.reduce((sum, d) => sum + d.count, 0);
}

/** Parse jogruber / Deno-style contribution JSON into calendar weeks. */
export function parseContributionPayload(data: Record<string, unknown>): ContributionData | null {
    const raw = data.contributions;
    if (!Array.isArray(raw) || raw.length === 0) return null;

    let weeks: ContributionDay[][] = [];
    let contributions: ContributionDay[] = [];

    // GitHub calendar format: contributions[][] (week columns, 7 rows each)
    if (Array.isArray(raw[0])) {
        weeks = (raw as ApiDay[][]).map((week, wi) => padWeek(week.map(parseDay), wi));
        contributions = weeks.flat();
    } else {
        contributions = (raw as ApiDay[]).map(parseDay);
        contributions = normalizeYear(contributions);
        weeks = groupIntoWeeks(contributions);
    }

    const validDays = contributions.filter((d) => d.date.length === 10 && !d.date.startsWith("pad"));
    if (validDays.length < 28) return null;

    return {
        contributions: validDays,
        weeks,
        totalContributions: totalFromPayload(data, validDays),
        yearLabel: yearRangeLabel(validDays),
    };
}

export function getContributionWeeks(data: ContributionData): ContributionDay[][] {
    return data.weeks.length > 0 ? data.weeks : groupIntoWeeks(data.contributions);
}

async function fetchFromUrl(url: string): Promise<ContributionData | null> {
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return null;
        const data = (await res.json()) as Record<string, unknown>;
        return parseContributionPayload(data);
    } catch {
        return null;
    }
}

export async function fetchContributions(username: string): Promise<ContributionData | null> {
    for (const buildUrl of CONTRIB_SOURCES) {
        const data = await fetchFromUrl(buildUrl(username));
        if (data) return data;
    }
    return null;
}

export function generateGitHubInsights(data: ContributionData): string[] {
    const insights: string[] = [];
    const sorted = [...data.contributions].sort((a, b) => a.date.localeCompare(b.date));
    const recent = sorted.slice(-30);
    const recentTotal = recent.reduce((s, d) => s + d.count, 0);
    const last7 = sorted.slice(-7).reduce((s, d) => s + d.count, 0);
    const weeks = getContributionWeeks(data);
    const activeDays = sorted.filter((d) => d.count > 0).length;

    insights.push(
        `${data.totalContributions.toLocaleString()} contributions over the past year (${weeks.length} weeks tracked).`,
    );

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
        insights.push(
            "Steady contributor. Pairing feature work with README or test commits strengthens your public profile.",
        );
    } else {
        insights.push(
            "Opportunity to increase visibility: even 2–3 commits per week improves recruiter-facing signals.",
        );
    }

    if (activeDays > 0) {
        insights.push(
            `${activeDays} active days in the window — ${Math.round((activeDays / sorted.length) * 100)}% of calendar days had commits.`,
        );
    }

    const maxDay = [...sorted].sort((a, b) => b.count - a.count)[0];
    if (maxDay && maxDay.count > 0) {
        insights.push(`Peak day: ${maxDay.date} with ${maxDay.count} contributions — great sprint energy.`);
    }

    return insights;
}

export const GITHUB_SNAKE = {
    light: "https://raw.githubusercontent.com/im-rihan/im-rihan/output/github-snake.svg",
    dark: "https://raw.githubusercontent.com/im-rihan/im-rihan/output/github-snake-dark.svg",
} as const;
