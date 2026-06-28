"use client";

import Link from "next/link";
import { ExternalLink, BookOpen } from "lucide-react";
import { projects, type Project } from "@/data/profile";
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
                <Link href={`/work/${project.caseStudySlug}/`} className={styles.actionLink} data-cursor="pointer">
                    <BookOpen size={14} />
                    Case study
                </Link>
            )}
        </div>
    );
}

export function Projects() {
    return (
        <section id="projects">
            <div className="container">
                <FadeIn>
                    <p className="section-label">Portfolio</p>
                    <h2 className="section-title">
                        Featured <span>Projects</span>
                    </h2>
                </FadeIn>
                <div className={`card-grid ${styles.grid}`}>
                    {projects.map((p, i) => (
                        <FadeIn key={p.title} delay={i * 0.06} className="card-cell">
                            <TiltCard className={`card-equal ${styles.card}`}>
                                <div className={styles.icon}>{p.icon}</div>
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
