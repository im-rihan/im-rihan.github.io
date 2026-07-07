import { aboutParagraphs, stats } from "@/data/profile";
import { Reveal } from "@/components/effects/Reveal";
import { TiltCard } from "@/components/effects/TiltCard";
import styles from "./About.module.css";

export function About() {
    return (
        <section id="about">
            <div className="container">
                <Reveal>
                    <p className="section-label">About Me</p>
                    <h2 className="section-title">
                        Turning ideas into <span>scalable software</span>
                    </h2>
                </Reveal>
                <div className={styles.grid}>
                    <Reveal className={styles.text}>
                        {aboutParagraphs.map((p) => (
                            <p key={p.slice(0, 30)}>{p}</p>
                        ))}
                    </Reveal>
                    <div className={styles.stats}>
                        {stats.map((s, i) => (
                            <Reveal key={s.label} delay={i * 0.08} className={styles.statCell}>
                                <TiltCard className={styles.statCard}>
                                    <div className={styles.num}>{s.num}</div>
                                    <div className={styles.label}>{s.label}</div>
                                </TiltCard>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
