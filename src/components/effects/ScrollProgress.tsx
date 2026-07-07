"use client";

import { useEffect, useState } from "react";
import styles from "./ScrollProgress.module.css";

// Computed once at module load time — this file is "use client" so it only
// ever runs in the browser; no SSR concern and no impure-function-in-render issue.
function detectNativeScrollTimeline(): boolean {
    return typeof CSS !== "undefined" && CSS.supports("animation-timeline", "scroll()");
}

export function ScrollProgress() {
    const [pct, setPct] = useState(0);
    // Lazy initializer: runs once on mount, never changes → stable, no effect needed.
    const [supportsNative] = useState(detectNativeScrollTimeline);

    useEffect(() => {
        if (supportsNative) return; // CSS scroll-driven animation handles it

        const onScroll = () => {
            const el = document.documentElement;
            const scrolled = el.scrollTop || document.body.scrollTop;
            const total = el.scrollHeight - el.clientHeight;
            setPct(total > 0 ? (scrolled / total) * 100 : 0);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [supportsNative]); // supportsNative is in deps — satisfies the exhaustive-deps rule

    return (
        <div
            className={`${styles.bar} ${supportsNative ? styles.native : ""}`}
            style={supportsNative ? undefined : { width: `${pct}%` }}
            aria-hidden
        />
    );
}
