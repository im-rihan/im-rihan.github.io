import { experience } from "@/data/profile";
import { Reveal } from "@/components/effects/Reveal";
import styles from "./Experience.module.css";

export function Experience() {
    return (
        <section id="experience">
            <div className="container">
                <Reveal>
                    <p className="section-label">Career</p>
                    <h2 className="section-title">
                        Work <span>Experience</span>
                    </h2>
                </Reveal>
                <div className={styles.timeline}>
                    {experience.map((job, i) => (
                        <Reveal key={job.role + job.company} delay={i * 0.1}>
                            <article className={styles.item}>
                                <div className={styles.header}>
                                    <h3>{job.role}</h3>
                                    <span className={styles.meta}>{job.period}</span>
                                </div>
                                <div className={styles.company}>{job.company}</div>
                                <p className={styles.subtitle}>{job.subtitle}</p>
                                <ul>
                                    {job.bullets.map((b) => (
                                        <li key={b.slice(0, 40)}>{b}</li>
                                    ))}
                                </ul>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
