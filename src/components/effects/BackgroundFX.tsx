"use client";

import { useEffect } from "react";
import styles from "./BackgroundFX.module.css";

/** CSS-only ambient effects — aurora, grid, scanlines, glow orbs, vignette. */
export function BackgroundFX() {
    useEffect(() => {
        const onMove = (clientX: number, clientY: number) => {
            const nx = (clientX / window.innerWidth) * 2 - 1;
            const ny = -((clientY / window.innerHeight) * 2 - 1);
            document.documentElement.style.setProperty("--mouse-nx", String(nx));
            document.documentElement.style.setProperty("--mouse-ny", String(ny));
        };

        const onMouse = (e: MouseEvent) => onMove(e.clientX, e.clientY);
        const onTouch = (e: TouchEvent) => {
            const t = e.touches[0];
            if (t) onMove(t.clientX, t.clientY);
        };

        window.addEventListener("mousemove", onMouse, { passive: true });
        window.addEventListener("touchmove", onTouch, { passive: true });
        return () => {
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
