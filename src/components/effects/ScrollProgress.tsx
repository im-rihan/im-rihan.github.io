"use client";

import { useEffect, useState } from "react";
import styles from "./ScrollProgress.module.css";

export function ScrollProgress() {
    const [pct, setPct] = useState(0);
    // Start false so the static HTML matches the server render (CSS is undefined
    // in Node), then detect the real capability post-hydration via useEffect.
    // Same SSR-safe pattern used in FadeIn / TiltCard.
    const [supportsNative, setSupportsNative] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSupportsNative(
            typeof CSS !== "undefined" && CSS.supports("animation-timeline", "scroll()"),
        );
    }, []);

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
    }, [supportsNative]);

    return (
        <div
            className={`${styles.bar} ${supportsNative ? styles.native : ""}`}
            style={supportsNative ? undefined : { width: `${pct}%` }}
            aria-hidden
        />
    );
}
