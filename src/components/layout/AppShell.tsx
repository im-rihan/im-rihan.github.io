"use client";

import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
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

// Subscribe to the custom scene-preference-change event (fired by ThemeToggle).
function subscribeScenePreference(callback: () => void) {
    window.addEventListener("scene-preference-change", callback);
    return () => window.removeEventListener("scene-preference-change", callback);
}

export function AppShell({ children }: { children: ReactNode }) {
    const [insightsOpen, setInsightsOpen] = useState(false);
    const pathname = usePathname();
    const pathnameRef = useRef(pathname);
    pathnameRef.current = pathname;

    // useSyncExternalStore: SSR-safe (server snapshot = false), subscribes to
    // manual preference-toggle events, and re-reads shouldLoadScene on each call.
    const showScene = useSyncExternalStore(
        subscribeScenePreference,
        () => shouldLoadScene(pathnameRef.current),
        () => false,
    );

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
