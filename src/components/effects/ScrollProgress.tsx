"use client";

import { useEffect, useState } from "react";
import styles from "./ScrollProgress.module.css";

// Feature-detect CSS scroll-driven animations (Chrome 115+).
// Computed once at module load time on the client — this file is "use client"
// so it never runs on the server, making window/CSS always available here.
function detectNativeScrollTimeline() {
    return typeof CSS !== "undefined" && CSS.supports("animation-timeline", "scroll()");
}

export function ScrollProgress() {
    const [pct, setPct] = useState(0);
    // Lazy initializer runs once on first client render — no useEffect needed.
    const [supportsNative] = useState(detectNativeScrollTimeline);

    useEffect(() => {
        if (supportsNative) return; // Native CSS handles it

        const onScroll = () => {
            const el = document.documentElement;
            const scrolled = el.scrollTop || document.body.scrollTop;
            const total = el.scrollHeight - el.clientHeight;
            setPct(total > 0 ? (scrolled / total) * 100 : 0);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div
            className={`${styles.bar} ${supportsNative ? styles.native : ""}`}
            style={supportsNative ? undefined : { width: `${pct}%` }}
            aria-hidden
        />
    );
}
