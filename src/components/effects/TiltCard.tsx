"use client";

import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, type ReactNode, type MouseEvent } from "react";
import { prefersReducedEffects } from "@/lib/device-capabilities";
import styles from "./TiltCard.module.css";

interface TiltCardProps {
    children: ReactNode;
    className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
    const [reduceEffects, setReduceEffects] = useState(true);

    useEffect(() => {
        // Reads window.matchMedia — only available after client mount.
        // Intentionally calling setState in effect here to flip from the SSR-safe
        // default (true → static) to the real user preference without a hydration mismatch.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReduceEffects(prefersReducedEffects());
    }, []);

    // Touch devices never fire onMouseMove, so the 3D tilt is dead weight —
    // skip the preserve-3d/will-change transform context entirely so it
    // can't glitch during scroll compositing.
    if (reduceEffects) {
        return <div className={`${styles.card} ${styles.cardStatic} glass-card ${className}`}>{children}</div>;
    }

    return <TiltCardInteractive className={className}>{children}</TiltCardInteractive>;
}

function TiltCardInteractive({ children, className = "" }: TiltCardProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const spring = { stiffness: 300, damping: 20 };
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), spring);
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), spring);

    const handleMove = (e: MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    const handleLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <m.div
            data-tilt-card
            data-cursor="card"
            className={`${styles.card} glass-card ${className}`}
            style={{ rotateX, rotateY, transformPerspective: 800 }}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {children}
        </m.div>
    );
}
