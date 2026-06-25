import { StatusDashboard } from "@/components/status/StatusDashboard";

export default function StatusPage() {
    return (
        <>
            <header className="page-header container">
                <h1>Status & Analytics</h1>
                <p>Visitor map, portfolio stats, and link health checks.</p>
            </header>
            <div className="container">
                <StatusDashboard />
            </div>
        </>
    );
}
