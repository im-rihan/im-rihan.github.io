"use client";

import { useEffect, useRef } from "react";
import styles from "./BackgroundFX.module.css";

/** CSS-only ambient effects — aurora, grid, scanlines, glow orbs, vignette. */
export function BackgroundFX() {
    const pointerRef = useRef({ nx: 0, ny: 0 });

    useEffect(() => {
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

        // Raw mousemove/touchmove can fire far more often than the screen
        // repaints. Writing custom properties on <html> triggers a style
        // recalc for every CSS rule that reads them (parallax orbs, glow),
        // so batch the actual write to at most once per animation frame.
        const applied = { nx: NaN, ny: NaN };
        let raf = requestAnimationFrame(function tick() {
            const { nx, ny } = pointerRef.current;
            if (nx !== applied.nx || ny !== applied.ny) {
                applied.nx = nx;
                applied.ny = ny;
                document.documentElement.style.setProperty("--mouse-nx", String(nx));
                document.documentElement.style.setProperty("--mouse-ny", String(ny));
            }
            raf = requestAnimationFrame(tick);
        });

        window.addEventListener("mousemove", onMouse, { passive: true });
        window.addEventListener("touchmove", onTouch, { passive: true });
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("touchmove", onTouch);
        };
    }, []);

    return (
        <div className={styles.fx} aria-hidden>
            <div className={styles.depthMesh} />
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
            <div className={styles.vignette} />
            <div className={styles.interactiveGlow} />
        </div>
    );
}
