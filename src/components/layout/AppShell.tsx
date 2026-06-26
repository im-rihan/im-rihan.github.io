"use client";

import { useState, type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Scene3D } from "@/components/effects/Scene3D";
import { BackgroundFX } from "@/components/effects/BackgroundFX";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { AnalysisOverlay, InsightsButton } from "@/components/overlay/AnalysisOverlay";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
import { ContactDock } from "./ContactDock";

export function AppShell({ children }: { children: ReactNode }) {
    const [insightsOpen, setInsightsOpen] = useState(false);

    return (
        <>
            <VisitorTracker />
            <BackgroundFX />
            <Scene3D />
            <CustomCursor />
            <Navbar />
            <main className="main-content">{children}</main>
            <Footer />
            <ContactDock />
            <InsightsButton onClick={() => setInsightsOpen(true)} />
            <AnalysisOverlay open={insightsOpen} onClose={() => setInsightsOpen(false)} />
        </>
    );
}
