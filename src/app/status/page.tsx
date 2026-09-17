import { StatusDashboard } from "@/components/status/StatusDashboard";
import { PageHeader } from "@/components/layout/PageHeader";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
    "Status & Analytics",
    "Live visitor map, system telemetry, endpoint health checks, uptime history, and service status — free geo, localStorage, and a free public hit API (no database of yours).",
    "/status",
);

export default function StatusPage() {
    return (
        <>
            <PageHeader
                title="Status & Analytics"
                description="Visitor count, country/region map, browser telemetry, and endpoint probes. Core analytics need no paid API and no database of yours — localStorage, free geo, and a free public hit counter."
            />
            <div className="container page-content">
                <StatusDashboard />
            </div>
        </>
    );
}
