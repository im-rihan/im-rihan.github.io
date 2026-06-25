"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useSpring } from "framer-motion";
import styles from "./CustomCursor.module.css";

type CursorMode = "default" | "pointer" | "card" | "text";

export function CustomCursor() {
    const [enabled, setEnabled] = useState(false);
    const [visible, setVisible] = useState(false);
    const [mode, setMode] = useState<CursorMode>("default");
    const [clicking, setClicking] = useState(false);

    const dotX = useSpring(0, { stiffness: 900, damping: 45, mass: 0.2 });
    const dotY = useSpring(0, { stiffness: 900, damping: 45, mass: 0.2 });
    const ringX = useSpring(0, { stiffness: 280, damping: 28, mass: 0.6 });
    const ringY = useSpring(0, { stiffness: 280, damping: 28, mass: 0.6 });
    const glowX = useSpring(0, { stiffness: 120, damping: 30, mass: 1 });
    const glowY = useSpring(0, { stiffness: 120, damping: 30, mass: 1 });

    const resolveMode = useCallback((target: EventTarget | null): CursorMode => {
        if (!(target instanceof Element)) return "default";
        const el = target.closest("[data-cursor]");
        if (el) return (el.getAttribute("data-cursor") as CursorMode) || "default";
        if (target.closest("a, button, .btn, input, textarea, select, label, [role='button']")) return "pointer";
        if (target.closest(".glass-card, [data-tilt-card]")) return "card";
        if (target.closest("p, h1, h2, h3, h4, span")) return "text";
        return "default";
    }, []);

    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isCoarse = window.matchMedia("(pointer: coarse)").matches;
        if (prefersReduced || isCoarse) return;

        setEnabled(true);
        document.body.classList.add("custom-cursor");

        const move = (e: MouseEvent) => {
            dotX.set(e.clientX);
            dotY.set(e.clientY);
            ringX.set(e.clientX);
            ringY.set(e.clientY);
            glowX.set(e.clientX);
            glowY.set(e.clientY);
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
            setMode(resolveMode(e.target));
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
    }, [dotX, dotY, ringX, ringY, glowX, glowY, resolveMode]);

    if (!enabled || !visible) return null;

    const modeClass =
        mode === "pointer" ? styles.pointer :
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
