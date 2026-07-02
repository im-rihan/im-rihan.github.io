import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/data/case-studies";
import { createPageMetadata } from "@/lib/site-metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import styles from "./case-study.module.css";

export function generateStaticParams() {
    return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const study = getCaseStudy(slug);
    if (!study) return {};
    return createPageMetadata(study.title, study.subtitle, `/work/${slug}`);
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const study = getCaseStudy(slug);
    if (!study) notFound();

    return (
        <>
            <PageHeader title={study.title} description={study.subtitle} />
            <div className={`container ${styles.page}`}>
                <div className={styles.stack}>
                    {study.stack.map((item) => (
                        <span key={item} className={styles.tag}>
                            {item}
                        </span>
                    ))}
                </div>

                <section className={`glass-card ${styles.block}`}>
                    <h2>Problem</h2>
                    <p>{study.problem}</p>
                </section>

                <section className={`glass-card ${styles.block}`}>
                    <h2>Approach</h2>
                    <ul>
                        {study.approach.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className={`glass-card ${styles.block}`}>
                    <h2>Results</h2>
                    <ul>
                        {study.results.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

                <div className={styles.links}>
                    {study.links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            prefetch={false}
                            className="btn btn-primary"
                            data-cursor="pointer"
                            {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
