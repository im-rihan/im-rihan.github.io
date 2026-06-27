"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
    title: string;
    description: ReactNode;
};

/** Subpage header — title only (brand lives in navbar; avoids stacking on the 3D globe). */
export function PageHeader({ title, description }: PageHeaderProps) {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const copyY = useTransform(scrollYProgress, [0, 1], [0, -20]);

    return (
        <header className={`page-header container ${styles.header}`} ref={ref}>
            <motion.div className={styles.copy} style={{ y: copyY }}>
                <h1>{title}</h1>
                <p>{description}</p>
            </motion.div>
        </header>
    );
}
