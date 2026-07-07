"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Scene3D } from "@/components/effects/Scene3D";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
import { CommandPaletteLauncher } from "@/components/command-palette/CommandPaletteLauncher";
import { ContactDock } from "./ContactDock";
import { HashScrollHandler } from "./HashScrollHandler";
import { shouldLoadScene } from "@/lib/scene-preference";

const BackgroundFX = dynamic(
    () => import("@/components/effects/BackgroundFX").then((m) => ({ default: m.BackgroundFX })),
    { ssr: false },
);

const CustomCursor = dynamic(
    () => import("@/components/effects/CustomCursor").then((m) => ({ default: m.CustomCursor })),
    { ssr: false },
);

const AnalysisOverlay = dynamic(
    () => import("@/components/overlay/AnalysisOverlay").then((m) => ({ default: m.AnalysisOverlay })),
    { ssr: false },
);

const InsightsButton = dynamic(
    () => import("@/components/overlay/AnalysisOverlay").then((m) => ({ default: m.InsightsButton })),
    { ssr: false },
);

// Stable subscribe function defined outside the component so useSyncExternalStore
// never re-subscribes on re-render. It only fires when the user toggles the scene.
function subscribeScenePreference(cb: () => void) {
    window.addEventListener("scene-preference-change", cb);
    return () => window.removeEventListener("scene-preference-change", cb);
}

export function AppShell({ children }: { children: ReactNode }) {
    const [insightsOpen, setInsightsOpen] = useState(false);
    const pathname = usePathname();

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
                <div key={pathname}>{children}</div>
            </main>
            <Footer />
            <ContactDock />
            <InsightsButton onClick={() => setInsightsOpen(true)} />
            <AnalysisOverlay open={insightsOpen} onClose={() => setInsightsOpen(false)} />
            <CommandPaletteLauncher />
        </>
    );
}
