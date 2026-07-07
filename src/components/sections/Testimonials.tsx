import { testimonials } from "@/data/testimonials";
import { Reveal } from "@/components/effects/Reveal";
import { TiltCard } from "@/components/effects/TiltCard";
import styles from "./Testimonials.module.css";

export function Testimonials() {
    return (
        <section id="testimonials" className={styles.section}>
            <div className="container">
                <Reveal>
                    <p className="section-label">Social proof</p>
                    <h2 className="section-title">
                        What teams <span>say</span>
                    </h2>
                </Reveal>
                <div className={`card-grid ${styles.grid}`}>
                    {testimonials.map((item, i) => (
                        <Reveal key={item.company + item.role} delay={i * 0.06} className="card-cell">
                            <TiltCard className={`card-equal glass-card ${styles.card}`}>
                                <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
                                <footer>
                                    <strong>{item.name}</strong>
                                    <span>
                                        {item.role} · {item.company}
                                    </span>
                                </footer>
                            </TiltCard>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
