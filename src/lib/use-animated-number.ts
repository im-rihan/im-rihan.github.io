"use client";

import { useEffect, useRef, useState } from "react";

function prefersReducedMotion(): boolean {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Tweens a displayed number toward `target` with a short ease-out, so stat
 * cards (visit totals, vitals once measured, etc.) count up instead of
 * popping — a small rAF loop, no animation library required.
 */
export function useAnimatedNumber(target: number, durationMs = 600): number {
    const [display, setDisplay] = useState(target);
    const fromRef = useRef(target);
    const firstRun = useRef(true);

    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            fromRef.current = target;
            return;
        }

        const from = fromRef.current;
        if (from === target || prefersReducedMotion()) {
            fromRef.current = target;
            setDisplay(target);
            return;
        }

        const start = performance.now();
        let raf = 0;

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(from + (target - from) * eased);
            if (t < 1) {
                raf = requestAnimationFrame(tick);
            } else {
                fromRef.current = target;
            }
        };
        raf = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(raf);
    }, [target, durationMs]);

    return display;
}
