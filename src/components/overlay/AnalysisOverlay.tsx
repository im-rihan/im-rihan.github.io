"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3 } from "lucide-react";
import { portfolioStats, skillGroups, siteMeta } from "@/data/profile";
import { certifications, certFilterCounts } from "@/data/certifications";
import styles from "./AnalysisOverlay.module.css";

interface AnalysisOverlayProps {
    open: boolean;
    onClose: () => void;
}

export function AnalysisOverlay({ open, onClose }: AnalysisOverlayProps) {
    const handleEsc = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (open) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [open, handleEsc]);

    const totalSkills = skillGroups.reduce((s, g) => s + g.tags.length, 0);
    const summary = `${siteMeta.name} is a ${siteMeta.title} with ${portfolioStats.yearsExperience} years of experience across ${portfolioStats.companies} companies. The portfolio showcases ${portfolioStats.projects}+ production projects, ${portfolioStats.certifications} certifications, and ${totalSkills} technical skills across ${portfolioStats.skillCategories} domains — specializing in fintech and real-estate platforms.`;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className={styles.backdrop}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className={`glass-card ${styles.modal}`}
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal
                        aria-labelledby="analysis-title"
                    >
                        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
                            <X size={20} />
                        </button>
                        <div className={styles.header}>
                            <BarChart3 size={24} />
                            <h2 id="analysis-title">Portfolio Insights</h2>
                        </div>
                        <p className={styles.summary}>{summary}</p>
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <span className={styles.num}>{portfolioStats.yearsExperience}</span>
                                <span>Years Exp.</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.num}>{portfolioStats.projects}+</span>
                                <span>Projects</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.num}>{portfolioStats.certifications}</span>
                                <span>Certs</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.num}>{totalSkills}</span>
                                <span>Skills</span>
                            </div>
                        </div>
                        <div className={styles.breakdown}>
                            <h3>Certifications by issuer</h3>
                            <ul>
                                <li>Udemy: {certFilterCounts.udemy}</li>
                                <li>freeCodeCamp: {certFilterCounts.fcc}</li>
                                <li>Institutes: {certFilterCounts.institute}</li>
                            </ul>
                            <h3>Skill categories</h3>
                            <ul>
                                {skillGroups.map((g) => (
                                    <li key={g.title}>
                                        {g.title}: {g.tags.length} skills
                                    </li>
                                ))}
                            </ul>
                            <h3>Latest certification</h3>
                            <p>{certifications[0]?.title} ({certifications[0]?.dateLabel})</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function InsightsButton({ onClick }: { onClick: () => void }) {
    return (
        <button type="button" className={styles.fab} onClick={onClick} aria-label="Open portfolio insights">
            <BarChart3 size={22} />
            <span>Insights</span>
        </button>
    );
}
