"use client";

import { useEffect, useState } from "react";
import styles from "./CursorGlow.module.css";

export function CursorGlow() {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isCoarse = window.matchMedia("(pointer: coarse)").matches;
        if (prefersReduced || isCoarse) return;

        const move = (e: MouseEvent) => {
            setPos({ x: e.clientX, y: e.clientY });
            setVisible(true);
        };
        const leave = () => setVisible(false);

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseleave", leave);
        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseleave", leave);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className={styles.glow}
            style={{
                left: pos.x,
                top: pos.y,
            }}
            aria-hidden
        />
    );
}
