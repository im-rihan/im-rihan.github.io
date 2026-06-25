"use client";

import { useState, type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Scene3D } from "@/components/effects/Scene3D";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { AnalysisOverlay, InsightsButton } from "@/components/overlay/AnalysisOverlay";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";

export function AppShell({ children }: { children: ReactNode }) {
    const [insightsOpen, setInsightsOpen] = useState(false);

    return (
        <>
            <VisitorTracker />
            <Scene3D />
            <CustomCursor />
            <Navbar />
            <main className="main-content">{children}</main>
            <Footer />
            <InsightsButton onClick={() => setInsightsOpen(true)} />
            <AnalysisOverlay open={insightsOpen} onClose={() => setInsightsOpen(false)} />
        </>
    );
}
