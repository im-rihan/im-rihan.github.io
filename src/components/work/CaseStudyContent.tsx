"use client";

import Link from "next/link";
import { FadeIn } from "@/components/effects/FadeIn";
import type { CaseStudy } from "@/data/case-studies";
import styles from "@/app/work/[slug]/case-study.module.css";

export function CaseStudyContent({ study }: { study: CaseStudy }) {
    return (
        <div className={`container ${styles.page}`}>
            <FadeIn>
                <div className={styles.stack}>
                    {study.stack.map((item) => (
                        <span key={item} className={styles.tag}>
                            {item}
                        </span>
                    ))}
                </div>
            </FadeIn>

            <FadeIn delay={0.08}>
                <section className={`glass-card ${styles.block}`}>
                    <h2>Problem</h2>
                    <p>{study.problem}</p>
                </section>
            </FadeIn>

            <FadeIn delay={0.16}>
                <section className={`glass-card ${styles.block}`}>
                    <h2>Approach</h2>
                    <ul>
                        {study.approach.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>
            </FadeIn>

            <FadeIn delay={0.24}>
                <section className={`glass-card ${styles.block}`}>
                    <h2>Results</h2>
                    <ul>
                        {study.results.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>
            </FadeIn>

            <FadeIn delay={0.3}>
                <div className={styles.links}>
                    {study.links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            prefetch={false}
                            className="btn btn-primary"
                            data-cursor="pointer"
                            {...(link.href.startsWith("http")
                                ? { target: "_blank", rel: "noopener noreferrer" }
                                : {})}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </FadeIn>
        </div>
    );
}
