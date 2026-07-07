"use client";

import { useSyncExternalStore, useState, type ReactNode } from "react";
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

// Stable subscribe function defined outside the component so useSyncExternalStore
// never re-subscribes on re-render. It only fires when the user toggles the scene.
function subscribeScenePreference(cb: () => void) {
    window.addEventListener("scene-preference-change", cb);
    return () => window.removeEventListener("scene-preference-change", cb);
}

export function AppShell({ children }: { children: ReactNode }) {
    const [insightsOpen, setInsightsOpen] = useState(false);
    const pathname = usePathname();

    // useSyncExternalStore is the idiomatic React 18 way to subscribe to external
    // mutable state. The snapshot closes over `pathname` so it naturally picks up
    // the latest route on every render — no ref mutation in render needed.
    // Server snapshot always returns false (no window), matching the static HTML.
    const showScene = useSyncExternalStore(
        subscribeScenePreference,
        () => shouldLoadScene(pathname),
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
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12, ease: "easeInOut" }}
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
