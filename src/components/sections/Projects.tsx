"use client";

import { projects } from "@/data/profile";
import { FadeIn } from "@/components/effects/FadeIn";
import { TiltCard } from "@/components/effects/TiltCard";
import styles from "./Projects.module.css";

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
                            </TiltCard>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
