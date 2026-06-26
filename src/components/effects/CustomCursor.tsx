"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useSpring } from "framer-motion";
import styles from "./CustomCursor.module.css";

type CursorMode = "default" | "pointer" | "card" | "text" | "nav";

interface TrailDot {
    id: string;
    x: number;
    y: number;
}

const TRAIL_LENGTH = 12;
const MAGNETIC_SELECTOR = "a, button, .btn, .glass-card, [data-tilt-card], [data-cursor]";
const NAV_SELECTOR = "[data-cursor='nav']";

export function CustomCursor() {
    const [enabled, setEnabled] = useState(false);
    const [visible, setVisible] = useState(false);
    const [mode, setMode] = useState<CursorMode>("default");
    const [clicking, setClicking] = useState(false);
    const [trail, setTrail] = useState<TrailDot[]>([]);
    const lastTrailAt = useRef(0);

    const dotX = useSpring(0, { stiffness: 1200, damping: 50, mass: 0.15 });
    const dotY = useSpring(0, { stiffness: 1200, damping: 50, mass: 0.15 });
    const ringX = useSpring(0, { stiffness: 180, damping: 22, mass: 0.5 });
    const ringY = useSpring(0, { stiffness: 180, damping: 22, mass: 0.5 });
    const glowX = useSpring(0, { stiffness: 80, damping: 25, mass: 1.2 });
    const glowY = useSpring(0, { stiffness: 80, damping: 25, mass: 1.2 });
    const orbitX = useSpring(0, { stiffness: 140, damping: 30, mass: 0.8 });
    const orbitY = useSpring(0, { stiffness: 140, damping: 30, mass: 0.8 });

    const resolveMode = useCallback((target: EventTarget | null): CursorMode => {
        if (!(target instanceof Element)) return "default";
        const el = target.closest("[data-cursor]");
        if (el) return (el.getAttribute("data-cursor") as CursorMode) || "default";
        if (target.closest("a, button, .btn, input, textarea, select, label, [role='button']")) return "pointer";
        if (target.closest(".glass-card, [data-tilt-card]")) return "card";
        if (target.closest("p, h1, h2, h3, h4, span")) return "text";
        return "default";
    }, []);

    const resolveMagneticOffset = useCallback((target: EventTarget | null, clientX: number, clientY: number, cursorMode: CursorMode) => {
        if (!(target instanceof Element)) return { x: 0, y: 0 };
        const navEl = target.closest(NAV_SELECTOR) as HTMLElement | null;
        if (navEl && cursorMode === "nav") {
            const rect = navEl.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = cx - clientX;
            const dy = cy - clientY;
            const dist = Math.hypot(dx, dy);
            if (dist > 120) return { x: 0, y: 0 };
            const pull = Math.min(18, dist * 0.35);
            const angle = Math.atan2(dy, dx);
            return { x: Math.cos(angle) * pull, y: Math.sin(angle) * pull };
        }
        const el = target.closest(MAGNETIC_SELECTOR) as HTMLElement | null;
        if (!el) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - clientX;
        const dy = cy - clientY;
        const dist = Math.hypot(dx, dy);
        const strength = cursorMode === "pointer" ? 0.45 : cursorMode === "nav" ? 0.38 : cursorMode === "card" ? 0.28 : 0.15;
        const maxPull = 56;
        if (dist > 180) return { x: 0, y: 0 };
        const pull = Math.min(maxPull, dist * strength);
        const angle = Math.atan2(dy, dx);
        return { x: Math.cos(angle) * pull, y: Math.sin(angle) * pull };
    }, []);

    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isCoarse = window.matchMedia("(pointer: coarse)").matches;
        if (prefersReduced || isCoarse) return;

        setEnabled(true);
        document.body.classList.add("custom-cursor");

        const move = (e: MouseEvent) => {
            const nextMode = resolveMode(e.target);
            setMode(nextMode);
            const magnetic = resolveMagneticOffset(e.target, e.clientX, e.clientY, nextMode);

            dotX.set(e.clientX);
            dotY.set(e.clientY);
            ringX.set(e.clientX + magnetic.x);
            ringY.set(e.clientY + magnetic.y);
            glowX.set(e.clientX);
            glowY.set(e.clientY);
            orbitX.set(e.clientX + magnetic.x * 0.5);
            orbitY.set(e.clientY + magnetic.y * 0.5);

            document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
            document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
            document.documentElement.style.setProperty(
                "--mouse-nx",
                String((e.clientX / window.innerWidth) * 2 - 1)
            );
            document.documentElement.style.setProperty(
                "--mouse-ny",
                String(-((e.clientY / window.innerHeight) * 2 - 1))
            );

            const now = performance.now();
            if (now - lastTrailAt.current > 24) {
                lastTrailAt.current = now;
                const pointId = `${now}-${Math.random().toString(36).slice(2, 8)}`;
                setTrail((prev) => [
                    { id: pointId, x: e.clientX, y: e.clientY },
                    ...prev.slice(0, TRAIL_LENGTH - 1),
                ]);
            }

            setVisible(true);
        };

        const down = () => setClicking(true);
        const up = () => setClicking(false);
        const leave = () => setVisible(false);
        const enter = () => setVisible(true);

        window.addEventListener("mousemove", move);
        window.addEventListener("mousedown", down);
        window.addEventListener("mouseup", up);
        document.documentElement.addEventListener("mouseleave", leave);
        document.documentElement.addEventListener("mouseenter", enter);

        return () => {
            document.body.classList.remove("custom-cursor");
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mousedown", down);
            window.removeEventListener("mouseup", up);
            document.documentElement.removeEventListener("mouseleave", leave);
            document.documentElement.removeEventListener("mouseenter", enter);
        };
    }, [dotX, dotY, ringX, ringY, glowX, glowY, orbitX, orbitY, resolveMode, resolveMagneticOffset]);

    if (!enabled || !visible) return null;

    const modeClass =
        mode === "pointer" ? styles.pointer :
        mode === "nav" ? styles.nav :
        mode === "card" ? styles.card :
        mode === "text" ? styles.text :
        styles.default;

    return (
        <>
            <motion.div
                className={styles.glow}
                style={{ x: glowX, y: glowY }}
                aria-hidden
            />
            <motion.div
                className={`${styles.orbit} ${modeClass}`}
                style={{ x: orbitX, y: orbitY }}
                aria-hidden
            />
            {trail.map((t, i) => (
                <span
                    key={t.id}
                    className={styles.trail}
                    style={{
                        transform: `translate(${t.x}px, ${t.y}px)`,
                        opacity: Math.max(0, 0.5 - i * 0.04),
                        width: Math.max(2, 7 - i * 0.45),
                        height: Math.max(2, 7 - i * 0.45),
                        marginLeft: Math.max(-1.5, -(3.5 - i * 0.22)),
                        marginTop: Math.max(-1.5, -(3.5 - i * 0.22)),
                    }}
                    aria-hidden
                />
            ))}
            <motion.div
                className={`${styles.ring} ${modeClass} ${clicking ? styles.clicking : ""}`}
                style={{ x: ringX, y: ringY }}
                aria-hidden
            />
            <motion.div
                className={`${styles.dot} ${modeClass} ${clicking ? styles.clicking : ""}`}
                style={{ x: dotX, y: dotY }}
                aria-hidden
            />
        </>
    );
}
