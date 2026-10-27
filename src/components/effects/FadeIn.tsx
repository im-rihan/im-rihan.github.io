"use client";

import { type ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

/**
 * Mount entrance: translateY only. Never sets opacity below 1 — homepage
 * sections must stay visible after SPA return (Playwright asserts opacity: 1).
 */
export function FadeIn({ children, className = "", delay = 0 }: FadeInProps) {
    const reduce = useReducedMotion();

    return (
        <m.div
            className={className}
            initial={reduce ? false : { y: 12 }}
            animate={{ y: 0 }}
            transition={{
                duration: reduce ? 0 : 0.22,
                delay: reduce ? 0 : delay,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </m.div>
    );
}
