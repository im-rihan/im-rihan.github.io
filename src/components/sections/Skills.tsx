"use client";

import { skillGroups } from "@/data/profile";
import { FadeIn } from "@/components/effects/FadeIn";
import { TiltCard } from "@/components/effects/TiltCard";
import styles from "./Skills.module.css";

export function Skills() {
    return (
        <section id="skills">
            <div className="container">
                <FadeIn>
                    <p className="section-label">Expertise</p>
                    <h2 className="section-title">
                        Technical <span>Skills</span>
                    </h2>
                </FadeIn>
                <div className={`card-grid ${styles.grid}`}>
                    {skillGroups.map((group, i) => (
                        <FadeIn key={group.title} delay={i * 0.06} className="card-cell">
                            <TiltCard className={`card-equal ${styles.card}`}>
                                <h3>{group.title}</h3>
                                <div className={styles.tags}>
                                    {group.tags.map((tag) => (
                                        <span key={tag} className={styles.tag}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </TiltCard>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
