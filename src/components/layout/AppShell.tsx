"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Scene3D } from "@/components/effects/Scene3D";
import { BackgroundFX } from "@/components/effects/BackgroundFX";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { AnalysisOverlay, InsightsButton } from "@/components/overlay/AnalysisOverlay";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
import { ContactDock } from "./ContactDock";
import { HashScrollHandler } from "./HashScrollHandler";
import { shouldLoadScene } from "@/lib/scene-preference";

export function AppShell({ children }: { children: ReactNode }) {
    const [insightsOpen, setInsightsOpen] = useState(false);
    const pathname = usePathname();
    const showScene = shouldLoadScene(pathname);
    const isChatPage = pathname === "/chat" || pathname === "/chat/";

    return (
        <>
            <a href="#main-content" className="skip-link">
                Skip to main content
            </a>
            <VisitorTracker />
            <HashScrollHandler />
            <BackgroundFX />
            {showScene && <Scene3D />}
            <CustomCursor />
            <Navbar />
            <main
                id="main-content"
                className={`main-content${isChatPage ? " main-content--chat" : ""}`}
            >
                {children}
            </main>
            {!isChatPage && <Footer />}
            <ContactDock />
            <InsightsButton onClick={() => setInsightsOpen(true)} />
            <AnalysisOverlay open={insightsOpen} onClose={() => setInsightsOpen(false)} />
        </>
    );
}
