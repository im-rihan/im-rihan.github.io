"use client";

import Link from "next/link";
import { siteMeta } from "@/data/profile";
import { SectionScrollLink } from "@/components/layout/SectionScrollLink";
import { resumeHtmlUrl, resumePdfUrl, resumeDocxUrl } from "@/lib/resume";
import { FadeIn } from "@/components/effects/FadeIn";
import { TiltCard } from "@/components/effects/TiltCard";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { LogoMark } from "@/components/layout/LogoMark";
import styles from "./Hero.module.css";

function HeroCodeSnippet() {
    return (
        <pre className={styles.codePre}>
            <code>
                <span className={styles.kw}>const</span>{" "}
                <span className={styles.id}>rihan</span>{" "}
                <span className={styles.punct}>=</span>{" "}
                <span className={styles.punct}>{"{"}</span>
                {"\n"}
                {"  "}
                <span className={styles.prop}>role</span>
                <span className={styles.punct}>:</span>{" "}
                <span className={styles.str}>&quot;Full Stack Developer&quot;</span>
                <span className={styles.punct}>,</span>
                {"\n"}
                {"  "}
                <span className={styles.prop}>company</span>
                <span className={styles.punct}>: [</span>
                <span className={styles.str}>&quot;HomeAbroad Inc.&quot;</span>
                <span className={styles.punct}>, </span>
                <span className={styles.str}>&quot;Ziffy.ai&quot;</span>
                <span className={styles.punct}>],</span>
                {"\n"}
                {"  "}
                <span className={styles.prop}>experience</span>
                <span className={styles.punct}>: </span>
                <span className={styles.str}>&quot;4+ years&quot;</span>
                <span className={styles.punct}>,</span>
                {"\n"}
                {"  "}
                <span className={styles.prop}>stack</span>
                <span className={styles.punct}>: [</span>
                <span className={styles.str}>&quot;React&quot;</span>
                <span className={styles.punct}>, </span>
                <span className={styles.str}>&quot;Next.js&quot;</span>
                <span className={styles.punct}>, </span>
                <span className={styles.str}>&quot;NestJS&quot;</span>
                <span className={styles.punct}>],</span>
                {"\n"}
                {"  "}
                <span className={styles.prop}>focus</span>
                <span className={styles.punct}>: [</span>
                <span className={styles.str}>&quot;Fintech&quot;</span>
                <span className={styles.punct}>, </span>
                <span className={styles.str}>&quot;AI&quot;</span>
                <span className={styles.punct}>, </span>
                <span className={styles.str}>&quot;DevOps&quot;</span>
                <span className={styles.punct}>],</span>
                {"\n"}
                {"  "}
                <span className={styles.fn}>build</span>
                <span className={styles.punct}>() {"{"}</span>
                {"\n"}
                {"    "}
                <span className={styles.kw}>return</span>{" "}
                <span className={styles.str}>&quot;scalable solutions&quot;</span>
                <span className={styles.punct}>;</span>
                {"\n"}
                {"  "}
                <span className={styles.punct}>{"}"}</span>
                {"\n"}
                <span className={styles.punct}>{"};"}</span>
            </code>
        </pre>
    );
}

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
                            <SectionScrollLink sectionId="projects" className="btn btn-primary">
                                View My Work
                            </SectionScrollLink>
                            <Link href="/work/" prefetch={false} className="btn btn-outline" data-cursor="pointer">
                                Case Studies
                            </Link>
                            <a
                                href={resumeHtmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                                data-cursor="pointer"
                            >
                                View Resume
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
                                <span className={styles.codeLogo} aria-hidden>
                                    <LogoMark size="sm" />
                                </span>
                                <span className={styles.codeTitle}>rihan.ts</span>
                            </div>
                            <HeroCodeSnippet />
                        </TiltCard>
                    </FadeIn>
                </div>
            </div>
        </header>
    );
}
