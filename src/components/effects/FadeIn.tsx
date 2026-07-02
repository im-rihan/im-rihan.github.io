"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function FadeIn({ children, className = "", delay = 0 }: FadeInProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-32px" }}
            transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}
