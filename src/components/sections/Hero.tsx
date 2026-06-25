"use client";

import Link from "next/link";
import { siteMeta } from "@/data/profile";
import { assetPath } from "@/lib/paths";
import { FadeIn } from "@/components/effects/FadeIn";
import { TiltCard } from "@/components/effects/TiltCard";
import { SocialLinks } from "@/components/ui/SocialLinks";
import styles from "./Hero.module.css";

export function Hero() {
    return (
        <header className={styles.hero} id="home">
            <div className="container">
                <div className={styles.grid}>
                    <FadeIn className={styles.content}>
                        {siteMeta.available && (
                            <div className={styles.badge}>
                                <span className={styles.dot} /> Available for opportunities
                            </div>
                        )}
                        <h1>
                            Hi, I&apos;m <span>{siteMeta.name}</span>
                        </h1>
                        <p className={styles.subtitle}>{siteMeta.tagline}</p>
                        <p className={styles.desc}>{siteMeta.description}</p>
                        <div className={styles.actions}>
                            <Link href="/#projects" className="btn btn-primary">
                                View My Work
                            </Link>
                            <a href={assetPath("/resume.pdf")} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                                Download Resume
                            </a>
                        </div>
                        <SocialLinks size="md" className={styles.social} />
                    </FadeIn>
                    <FadeIn delay={0.15} className={styles.visual}>
                        <TiltCard className={styles.codeCard}>
                            <div className={styles.codeHeader}>
                                <span className={styles.red} />
                                <span className={styles.yellow} />
                                <span className={styles.green} />
                            </div>
                            <pre>
                                <code>{`const rihan = {
  role: "Full Stack Developer",
  company: ["HomeAbroad Inc.", "Ziffy.ai"],
  experience: "4+ years",
  stack: ["React", "Next.js", "NestJS"],
  focus: ["Fintech", "AI", "DevOps"],
  build() {
    return "scalable solutions";
  }
};`}</code>
                            </pre>
                        </TiltCard>
                    </FadeIn>
                </div>
            </div>
        </header>
    );
}
