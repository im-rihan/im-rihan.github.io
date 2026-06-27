import type { CountryStat, VisitRecord } from "@/lib/visitor-analytics";

export function topCountryShare(countries: CountryStat[], total: number): number {
    if (!total || !countries.length) return 0;
    return Math.round((countries[0].count / total) * 100);
}

export function aggregateByField(
    visits: VisitRecord[],
    field: "browser" | "page" | "os"
): { label: string; count: number }[] {
    const map = new Map<string, number>();
    visits.forEach((v) => {
        const label = v[field] || "Unknown";
        map.set(label, (map.get(label) ?? 0) + 1);
    });
    return [...map.entries()]
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count);
}

export function formatVisitTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}
