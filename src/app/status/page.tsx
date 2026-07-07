import { StatusDashboard } from "@/components/status/StatusDashboard";
import { PageHeader } from "@/components/layout/PageHeader";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
    "Status & Analytics",
    "Live visitor map, system telemetry, endpoint health checks, uptime history, and service status.",
    "/status",
);

export default function StatusPage() {
    return (
        <>
            <PageHeader
                title="Status & Analytics"
                description="Live visitor map, browser telemetry, endpoint probes with uptime history, and backend service status."
            />
            <div className="container page-content">
                <StatusDashboard />
            </div>
        </>
    );
}
