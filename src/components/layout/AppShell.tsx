"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Scene3D } from "@/components/effects/Scene3D";
import { BackgroundFX } from "@/components/effects/BackgroundFX";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { AnalysisOverlay, InsightsButton } from "@/components/overlay/AnalysisOverlay";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
import { CommandPaletteLauncher } from "@/components/command-palette/CommandPaletteLauncher";
import { ContactDock } from "./ContactDock";
import { HashScrollHandler } from "./HashScrollHandler";
import { shouldLoadScene } from "@/lib/scene-preference";

export function AppShell({ children }: { children: ReactNode }) {
    const [insightsOpen, setInsightsOpen] = useState(false);
    const pathname = usePathname();
    // Start false so the first client render always matches the statically
    // exported server HTML (which has no window/localStorage access), then
    // resolve the real preference post-mount to avoid a hydration mismatch.
    const [showScene, setShowScene] = useState(false);

    useEffect(() => {
        setShowScene(shouldLoadScene(pathname));
        const sync = () => setShowScene(shouldLoadScene(pathname));
        window.addEventListener("scene-preference-change", sync);
        return () => window.removeEventListener("scene-preference-change", sync);
    }, [pathname]);

    return (
        <>
            <a href="#main-content" className="skip-link">
                Skip to main content
            </a>
            <ScrollProgress />
            <VisitorTracker />
            <HashScrollHandler />
            <BackgroundFX />
            {showScene && <Scene3D />}
            <CustomCursor />
            <Navbar />
            <main id="main-content" className="main-content">
                <AnimatePresence mode="wait" initial={false}>
                    <m.div
                        key={pathname}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18, ease: "easeInOut" }}
                    >
                        {children}
                    </m.div>
                </AnimatePresence>
            </main>
            <Footer />
            <ContactDock />
            <InsightsButton onClick={() => setInsightsOpen(true)} />
            <AnalysisOverlay open={insightsOpen} onClose={() => setInsightsOpen(false)} />
            <CommandPaletteLauncher />
        </>
    );
}
