"use client";

import { aboutParagraphs, stats } from "@/data/profile";
import { FadeIn } from "@/components/effects/FadeIn";
import { TiltCard } from "@/components/effects/TiltCard";
import styles from "./About.module.css";

export function About() {
    return (
        <section id="about">
            <div className="container">
                <FadeIn>
                    <p className="section-label">About Me</p>
                    <h2 className="section-title">
                        Turning ideas into <span>scalable software</span>
                    </h2>
                </FadeIn>
                <div className={styles.grid}>
                    <FadeIn className={styles.text}>
                        {aboutParagraphs.map((p) => (
                            <p key={p.slice(0, 30)}>{p}</p>
                        ))}
                    </FadeIn>
                    <div className={styles.stats}>
                        {stats.map((s, i) => (
                            <FadeIn key={s.label} delay={i * 0.08} className={styles.statCell}>
                                <TiltCard className={styles.statCard}>
                                    <div className={styles.num}>{s.num}</div>
                                    <div className={styles.label}>{s.label}</div>
                                </TiltCard>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
