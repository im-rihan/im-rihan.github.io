"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedEffects } from "@/lib/device-capabilities";
import styles from "./BackgroundFX.module.css";

/** CSS-only ambient effects — aurora, grid, scanlines, glow orbs, vignette. */
export function BackgroundFX() {
    const pointerRef = useRef({ nx: 0, ny: 0 });
    // Loaded via dynamic import with ssr:false, so this initializer only ever
    // runs in the browser — safe to read matchMedia during the first render
    // without a hydration mismatch, avoiding a setState-in-effect cascade.
    const [reduced] = useState(() => prefersReducedEffects());

    useEffect(() => {
        if (reduced) return;

        const onMove = (clientX: number, clientY: number) => {
            pointerRef.current = {
                nx: (clientX / window.innerWidth) * 2 - 1,
                ny: -((clientY / window.innerHeight) * 2 - 1),
            };
        };

        const onMouse = (e: MouseEvent) => onMove(e.clientX, e.clientY);
        const onTouch = (e: TouchEvent) => {
            const t = e.touches[0];
            if (t) onMove(t.clientX, t.clientY);
        };

        const applied = { nx: NaN, ny: NaN };
        let raf = 0;
        let running = !document.hidden;

        const tick = () => {
            if (!running) return;
            const { nx, ny } = pointerRef.current;
            if (nx !== applied.nx || ny !== applied.ny) {
                applied.nx = nx;
                applied.ny = ny;
                document.documentElement.style.setProperty("--mouse-nx", String(nx));
                document.documentElement.style.setProperty("--mouse-ny", String(ny));
            }
            raf = requestAnimationFrame(tick);
        };

        const startLoop = () => {
            if (running) return;
            running = true;
            raf = requestAnimationFrame(tick);
        };

        const stopLoop = () => {
            running = false;
            cancelAnimationFrame(raf);
        };

        const onVisibility = () => {
            if (document.hidden) stopLoop();
            else startLoop();
        };

        startLoop();
        document.addEventListener("visibilitychange", onVisibility);
        window.addEventListener("mousemove", onMouse, { passive: true });
        window.addEventListener("touchmove", onTouch, { passive: true });

        return () => {
            stopLoop();
            document.removeEventListener("visibilitychange", onVisibility);
            window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("touchmove", onTouch);
        };
    }, [reduced]);

    return (
        <div className={styles.fx} aria-hidden>
            <div className={styles.depthMesh} />
            {!reduced && (
                <>
                    <div className={styles.aurora} />
                    <div className={styles.lightBeams} />
                    <div className={styles.orbs}>
                        <span className={styles.orbA} />
                        <span className={styles.orbB} />
                        <span className={styles.orbC} />
                    </div>
                    <div className={styles.starDust} />
                    <div className={styles.horizon} />
                    <div className={styles.gridPulse} />
                    <div className={styles.scanlines} />
                    <div className={styles.noise} />
                    <div className={styles.interactiveGlow} />
                </>
            )}
            <div className={styles.vignette} />
        </div>
    );
}
