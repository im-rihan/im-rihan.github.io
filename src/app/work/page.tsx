import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { caseStudies } from "@/data/case-studies";
import { createPageMetadata } from "@/lib/site-metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import styles from "./work.module.css";

export const metadata = createPageMetadata(
    "Case Studies",
    "Deep dives into production fintech and real-estate projects — Ziffy.ai, NestJS APIs, integrations, and data pipelines.",
    "/work",
);

export default function WorkIndexPage() {
    return (
        <>
            <PageHeader
                title="Case Studies"
                description={
                    <>
                        Production systems built at Ziffy.ai and HomeAbroad Inc. — problem, approach, and results for
                        each project.
                    </>
                }
            />
            <div className={`container ${styles.page}`}>
                <div className={styles.grid}>
                    {caseStudies.map((study) => (
                        <Link
                            key={study.slug}
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
                    ))}
                </div>
            </div>
        </>
    );
}
