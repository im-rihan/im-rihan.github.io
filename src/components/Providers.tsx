"use client";

import { ThemeProvider } from "next-themes";
import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Code-split loader — see src/lib/motion-features.ts for why domMax is needed.
const loadMotionFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="portfolio-theme">
            <LazyMotion features={loadMotionFeatures}>
                <MotionConfig reducedMotion="user">{children}</MotionConfig>
            </LazyMotion>
        </ThemeProvider>
    );
}
