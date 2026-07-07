"use client";

import { useEffect, useState } from "react";
import styles from "./ScrollProgress.module.css";

export function ScrollProgress() {
    const [pct, setPct] = useState(0);
    const [supportsNative, setSupportsNative] = useState(false);

    useEffect(() => {
        // Feature-detect CSS scroll-driven animations (Chrome 115+)
        const supports =
            typeof CSS !== "undefined" &&
            CSS.supports("animation-timeline", "scroll()");
        setSupportsNative(supports);

        if (supports) return; // Native CSS handles it

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
