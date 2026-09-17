import { StatusDashboard } from "@/components/status/StatusDashboard";
import { PageHeader } from "@/components/layout/PageHeader";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
    "Status & Analytics",
    "Live visitor map, system telemetry, endpoint health checks, uptime history, and service status — works on static GitHub Pages with free geo lookups and localStorage.",
    "/status",
);

export default function StatusPage() {
    return (
        <>
            <PageHeader
                title="Status & Analytics"
                description="Visitor count, country/region map, browser telemetry, and endpoint probes. Core analytics work without a paid API — localStorage plus free geo lookups; Supabase and CountAPI are optional."
            />
            <div className="container page-content">
                <StatusDashboard />
            </div>
        </>
    );
}
