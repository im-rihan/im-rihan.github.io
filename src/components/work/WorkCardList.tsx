"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { FadeIn } from "@/components/effects/FadeIn";
import type { CaseStudy } from "@/data/case-studies";
import styles from "@/app/work/work.module.css";

export function WorkCardList({ studies }: { studies: CaseStudy[] }) {
    return (
        <div className={styles.grid}>
            {studies.map((study, i) => (
                <FadeIn key={study.slug} delay={i * 0.06}>
                    <Link
                        href={`/work/${study.slug}/`}
                        prefetch={false}
                        className={`glass-card ${styles.card}`}
                        data-cursor="pointer"
                    >
                        <div className={styles.cardHead}>
                            <BookOpen size={18} className={styles.icon} aria-hidden />
                            <span className={styles.count}>{study.stack.length} technologies</span>
                        </div>
                        <h2>{study.title}</h2>
                        <p className={styles.subtitle}>{study.subtitle}</p>
                        <div className={styles.tags}>
                            {study.stack.slice(0, 4).map((tag) => (
                                <span key={tag} className={styles.tag}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <span className={styles.cta}>
                            Read case study
                            <ArrowRight size={16} aria-hidden />
                        </span>
                    </Link>
                </FadeIn>
            ))}
        </div>
    );
}
