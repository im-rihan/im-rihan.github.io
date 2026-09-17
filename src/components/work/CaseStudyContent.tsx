"use client";

import Link from "next/link";
import { FadeIn } from "@/components/effects/FadeIn";
import type { CaseStudy } from "@/data/case-studies";
import styles from "@/app/work/[slug]/case-study.module.css";

export function CaseStudyContent({ study }: { study: CaseStudy }) {
    return (
        <div className={`container ${styles.page}`}>
            {(study.role || (study.highlights && study.highlights.length > 0)) && (
                <FadeIn>
                    <div className={styles.metaRow}>
                        {study.role && <span className={styles.role}>{study.role}</span>}
                        {study.highlights?.map((item) => (
                            <span key={item} className={styles.highlight}>
                                {item}
                            </span>
                        ))}
                    </div>
                </FadeIn>
            )}

            <FadeIn delay={0.04}>
                <div className={styles.stack}>
                    {study.stack.map((item) => (
                        <span key={item} className={styles.tag}>
                            {item}
                        </span>
                    ))}
                </div>
            </FadeIn>

            {study.features && study.features.length > 0 && (
                <FadeIn delay={0.08}>
                    <section className={`glass-card ${styles.block}`}>
                        <h2>Key features</h2>
                        <div className={styles.featureTable} role="table" aria-label="Key features">
                            <div className={styles.featureHead} role="row">
                                <span role="columnheader">Feature</span>
                                <span role="columnheader">What it does</span>
                            </div>
                            {study.features.map((feature) => (
                                <div key={feature.name} className={styles.featureRow} role="row">
                                    <strong role="cell">{feature.name}</strong>
                                    <span role="cell">{feature.detail}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </FadeIn>
            )}

            <FadeIn delay={0.12}>
                <section className={`glass-card ${styles.block}`}>
                    <h2>Problem</h2>
                    <p>{study.problem}</p>
                </section>
            </FadeIn>

            <FadeIn delay={0.18}>
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
