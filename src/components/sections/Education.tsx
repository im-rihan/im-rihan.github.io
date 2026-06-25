"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Award, GraduationCap } from "lucide-react";
import { certifications, certFilterCounts, type CertIssuer } from "@/data/certifications";
import { education } from "@/data/profile";
import { FadeIn } from "@/components/effects/FadeIn";
import styles from "./Education.module.css";

type Filter = "all" | CertIssuer;

const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: certFilterCounts.all },
    { id: "udemy", label: "Udemy", count: certFilterCounts.udemy },
    { id: "fcc", label: "freeCodeCamp", count: certFilterCounts.fcc },
    { id: "institute", label: "Institutes", count: certFilterCounts.institute },
];

export function Education() {
    const [filter, setFilter] = useState<Filter>("all");
    const visible = certifications.filter(
        (c) => filter === "all" || c.issuer === filter
    );

    return (
        <section id="education">
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
                    <div className={styles.certsBlock}>
                        <div className={styles.certsHeader}>
                            <div>
                                <h3>Licenses & Certifications</h3>
                                <p>14 credentials · newest first</p>
                            </div>
                            <div className={styles.filters} role="tablist">
                                {filters.map((f) => (
                                    <button
                                        key={f.id}
                                        type="button"
                                        role="tab"
                                        className={filter === f.id ? styles.active : ""}
                                        onClick={() => setFilter(f.id)}
                                    >
                                        {f.label} <span>{f.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={styles.certGrid}>
                            {visible.map((cert, i) => {
                                const inner = (
                                    <>
                                        <div className={`${styles.accent} ${styles[cert.issuer]}`} />
                                        <div className={styles.inner}>
                                            <div className={styles.certHeader}>
                                                <div className={`${styles.icon} ${styles[cert.issuer]}`}>
                                                    {cert.issuer === "institute" ? (
                                                        <GraduationCap size={20} />
                                                    ) : cert.issuer === "fcc" ? (
                                                        <Award size={20} />
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
                                            key={cert.title}
                                            href={cert.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${styles.certCard} ${styles.linked}`}
                                            style={{ "--i": i } as React.CSSProperties}
                                            aria-label={`View certificate: ${cert.title}`}
                                        >
                                            {inner}
                                        </Link>
                                    );
                                }

                                return (
                                    <article
                                        key={cert.title}
                                        className={styles.certCard}
                                        style={{ "--i": i } as React.CSSProperties}
                                    >
                                        {inner}
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
