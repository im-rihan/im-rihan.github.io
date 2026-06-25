"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";
import styles from "./TiltCard.module.css";

interface TiltCardProps {
    children: ReactNode;
    className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
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
        <motion.div
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
        </motion.div>
    );
}
