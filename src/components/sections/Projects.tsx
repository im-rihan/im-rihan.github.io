"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ExternalLink, BookOpen } from "lucide-react";
import { projects, projectCategories, type Project, type ProjectCategory } from "@/data/profile";
import { FadeIn } from "@/components/effects/FadeIn";
import { TiltCard } from "@/components/effects/TiltCard";
import styles from "./Projects.module.css";

function ProjectActions({ project }: { project: Project }) {
    return (
        <div className={styles.actions}>
            {project.url && (
                <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionLink}
                    data-cursor="pointer"
                >
                    <ExternalLink size={14} />
                    Visit
                </a>
            )}
            {project.caseStudySlug && (
                <Link href={`/work/${project.caseStudySlug}/`} prefetch={false} className={styles.actionLink} data-cursor="pointer">
                    <BookOpen size={14} />
                    Case study
                </Link>
            )}
        </div>
    );
}

export function Projects() {
    const [filter, setFilter] = useState<ProjectCategory | "all">("all");

    const visible = useMemo(
        () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
        [filter],
    );

    return (
        <section id="projects">
            <div className="container">
                <FadeIn>
                    <div className={styles.sectionHead}>
                        <div>
                            <p className="section-label">Portfolio</p>
                            <h2 className="section-title">
                                Featured <span>Projects</span>
                            </h2>
                        </div>
                        <Link href="/work/" prefetch={false} className={styles.viewAll} data-cursor="pointer">
                            All case studies
                            <ArrowRight size={16} aria-hidden />
                        </Link>
                    </div>
                    <div className={styles.filters} role="tablist" aria-label="Filter projects by category">
                        {projectCategories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                role="tab"
                                aria-selected={filter === cat.id}
                                className={`${styles.filterChip} ${filter === cat.id ? styles.filterActive : ""}`}
                                onClick={() => setFilter(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </FadeIn>
                <div className={`card-grid ${styles.grid}`}>
                    {visible.map((p, i) => (
                        <FadeIn key={p.title} delay={i * 0.06} className="card-cell">
                            <TiltCard className={`card-equal ${styles.card}`}>
                                <div className={styles.cardTop}>
                                    <div className={styles.icon}>{p.icon}</div>
                                    {p.caseStudySlug && (
                                        <span className={styles.badge}>
                                            <BookOpen size={12} aria-hidden />
                                            Case study
                                        </span>
                                    )}
                                </div>
                                <h3>{p.title}</h3>
                                <div className={styles.stack}>{p.stack}</div>
                                <p>{p.description}</p>
                                <ProjectActions project={p} />
                            </TiltCard>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
