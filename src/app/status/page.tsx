import { StatusDashboard } from "@/components/status/StatusDashboard";
import { PageHeader } from "@/components/layout/PageHeader";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
    "Analytics",
    "Live visitor map, system telemetry, geo analytics, and link health monitoring."
);

export default function StatusPage() {
    return (
        <>
            <PageHeader
                title="Status & Analytics"
                description="Live visitor map, system telemetry, geo analytics, and link health monitoring."
            />
            <div className="container">
                <StatusDashboard />
            </div>
        </>
    );
}
