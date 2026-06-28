"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Calendar, Award, GraduationCap, ChevronDown } from "lucide-react";
import { certifications, certFilterCounts, type CertIssuer, type Certification } from "@/data/certifications";
import { education } from "@/data/profile";
import { FadeIn } from "@/components/effects/FadeIn";
import styles from "./Education.module.css";

type Filter = "all" | CertIssuer;

const INITIAL_VISIBLE = 6;

const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: certFilterCounts.all },
    { id: "udemy", label: "Udemy", count: certFilterCounts.udemy },
    { id: "fcc", label: "freeCodeCamp", count: certFilterCounts.fcc },
    { id: "institute", label: "Institutes", count: certFilterCounts.institute },
];

const certMotion = {
    initial: { opacity: 0, y: 16, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.97 },
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
};

function CertCard({ cert, index }: { cert: Certification; index: number }) {
    const inner = (
        <>
            <div className={`${styles.accent} ${styles[cert.issuer]}`} />
            <div className={styles.inner}>
                <div className={styles.certHeader}>
                    <div className={`${styles.icon} ${styles[cert.issuer]}`}>
                        {cert.issuer === "institute" ? (
                            <GraduationCap size={20} />
                        ) : (
                            <Award size={20} />
                        )}
                    </div>
                    <span className={`${styles.issuer} ${styles[cert.issuer]}`}>
                        {cert.issuerLabel}
                    </span>
                </div>
                <h4>{cert.title}</h4>
                <footer className={styles.footer}>
                    <span className={styles.date}>
                        <Calendar size={14} />
                        <time dateTime={cert.date}>{cert.dateLabel}</time>
                    </span>
                    {cert.url && (
                        <span className={styles.link}>View certificate →</span>
                    )}
                </footer>
            </div>
        </>
    );

    if (cert.url) {
        return (
            <Link
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.certCard} ${styles.linked}`}
                style={{ "--i": index } as React.CSSProperties}
                aria-label={`View certificate: ${cert.title}`}
            >
                {inner}
            </Link>
        );
    }

    return (
        <article
            className={styles.certCard}
            style={{ "--i": index } as React.CSSProperties}
        >
            {inner}
        </article>
    );
}

export function Education() {
    const [filter, setFilter] = useState<Filter>("all");
    const [expanded, setExpanded] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const wasExpanded = useRef(false);

    const visible = certifications.filter(
        (c) => filter === "all" || c.issuer === filter
    );
    const hasMore = visible.length > INITIAL_VISIBLE;

    const handleFilter = (id: Filter) => {
        setFilter(id);
        setExpanded(false);
    };

    const toggleExpanded = () => {
        setExpanded((prev) => !prev);
    };

    useEffect(() => {
        if (expanded && !wasExpanded.current) {
            requestAnimationFrame(() => {
                toggleRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            });
        }
        wasExpanded.current = expanded;
    }, [expanded]);

    return (
        <section id="education" className={styles.section}>
            <div className="container">
                <FadeIn>
                    <p className="section-label">Background</p>
                    <h2 className="section-title">
                        Education & <span>Certifications</span>
                    </h2>
                </FadeIn>

                <FadeIn>
                    <div className={`glass-card ${styles.eduCard}`}>
                        <h3>Education</h3>
                        {education.map((e) => (
                            <div key={e.degree} className={styles.eduItem}>
                                <div className="degree">{e.degree}</div>
                                <div className={styles.school}>{e.school}</div>
                                {e.campus && <div className={styles.campus}>{e.campus}</div>}
                                {e.year && <div className={styles.year}>{e.year}</div>}
                            </div>
                        ))}
                    </div>
                </FadeIn>

                <FadeIn>
                    <div className={`glass-card ${styles.certsBlock}`}>
                        <div className={styles.certsHeader}>
                            <div>
                                <h3>Licenses & Certifications</h3>
                                <p>{visible.length} credentials · newest first</p>
                            </div>
                            <div className={styles.filtersScroll}>
                                <div className={styles.filters} role="tablist">
                                    {filters.map((f) => (
                                        <button
                                            key={f.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={filter === f.id}
                                            className={filter === f.id ? styles.active : ""}
                                            onClick={() => handleFilter(f.id)}
                                        >
                                            {f.label} <span>{f.count}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <LayoutGroup id="cert-grid">
                            <motion.div
                                className={styles.certGrid}
                                layout
                                transition={{ layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
                            >
                                <AnimatePresence initial={false} mode="popLayout">
                                    {visible.map((cert, i) => {
                                        if (!expanded && i >= INITIAL_VISIBLE) return null;

                                        return (
                                            <motion.div
                                                key={`${filter}-${cert.title}`}
                                                layout
                                                className={styles.certCell}
                                                {...certMotion}
                                                transition={{
                                                    ...certMotion.transition,
                                                    delay:
                                                        expanded && i >= INITIAL_VISIBLE
                                                            ? (i - INITIAL_VISIBLE) * 0.04
                                                            : 0,
                                                    layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                                                }}
                                            >
                                                <CertCard cert={cert} index={i} />
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        </LayoutGroup>

                        {hasMore && (
                            <motion.button
                                ref={toggleRef}
                                type="button"
                                className={styles.viewMoreBtn}
                                onClick={toggleExpanded}
                                aria-expanded={expanded}
                                layout
                                whileTap={{ scale: 0.98 }}
                                transition={{ layout: { duration: 0.3 } }}
                            >
                                <motion.span
                                    className={styles.viewMoreIcon}
                                    animate={{ rotate: expanded ? 180 : 0 }}
                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <ChevronDown size={18} />
                                </motion.span>
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={expanded ? "less" : "more"}
                                        className={styles.viewMoreLabel}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.22 }}
                                    >
                                        {expanded
                                            ? "Show fewer certifications"
                                            : `View all ${visible.length} certifications`}
                                    </motion.span>
                                </AnimatePresence>
                            </motion.button>
                        )}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
