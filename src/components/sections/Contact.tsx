"use client";

import { siteMeta } from "@/data/profile";
import { resumeHtmlUrl, resumePdfUrl, resumeDocxUrl } from "@/lib/resume";
import { ContactForm } from "./ContactForm";
import { FadeIn } from "@/components/effects/FadeIn";
import { TiltCard } from "@/components/effects/TiltCard";
import { SocialLinks } from "@/components/ui/SocialLinks";
import {
    Mail,
    Phone,
    MapPin,
    Github,
    Linkedin,
    FileText,
    Download,
    MessageCircle,
} from "lucide-react";
import styles from "./Contact.module.css";

const contactMethods = [
    {
        icon: Mail,
        label: "Email",
        value: siteMeta.email,
        href: `mailto:${siteMeta.email}`,
        external: false,
    },
    {
        icon: Phone,
        label: "Phone",
        value: siteMeta.phone,
        href: `tel:${siteMeta.phone.replace(/\s/g, "")}`,
        external: false,
    },
    {
        icon: MapPin,
        label: "Location",
        value: siteMeta.location,
        href: null,
        external: false,
    },
    {
        icon: Linkedin,
        label: "LinkedIn",
        value: "linkedin.com/in/im-rihan",
        href: siteMeta.linkedin,
        external: true,
    },
    {
        icon: Github,
        label: "GitHub",
        value: "github.com/im-rihan",
        href: siteMeta.github,
        external: true,
    },
];

export function Contact() {
    return (
        <section id="contact" className={styles.section}>
            <div className="container">
                <FadeIn>
                    <p className="section-label">Get in Touch</p>
                    <h2 className="section-title">
                        Let&apos;s <span>connect</span>
                    </h2>
                </FadeIn>

                <div className={styles.grid}>
                    <FadeIn className={styles.main}>
                        <div className={styles.intro}>
                            <MessageCircle size={22} className={styles.introIcon} />
                            <div>
                                <h3>Open to opportunities</h3>
                                <p>
                                    Networking, collaboration, or full-time roles — I&apos;d love to hear from you.
                                    Response within 24–48 hours.
                                </p>
                            </div>
                        </div>

                        <div className={styles.methods}>
                            {contactMethods.map((item, i) => {
                                const Icon = item.icon;
                                const inner = (
                                    <>
                                        <span className={styles.methodIcon}>
                                            <Icon size={20} />
                                        </span>
                                        <span className={styles.methodBody}>
                                            <span className={styles.methodLabel}>{item.label}</span>
                                            <span className={styles.methodValue}>{item.value}</span>
                                        </span>
                                    </>
                                );

                                if (item.href) {
                                    return (
                                        <FadeIn key={item.label} delay={i * 0.06}>
                                            <a
                                                href={item.href}
                                                className={`glass-card ${styles.methodCard}`}
                                                target={item.external ? "_blank" : undefined}
                                                rel={item.external ? "noopener noreferrer" : undefined}
                                                data-cursor="pointer"
                                            >
                                                {inner}
                                            </a>
                                        </FadeIn>
                                    );
                                }

                                return (
                                    <FadeIn key={item.label} delay={i * 0.06}>
                                        <div className={`glass-card ${styles.methodCard}`}>{inner}</div>
                                    </FadeIn>
                                );
                            })}
                        </div>

                        <div className={styles.socialBlock}>
                            <span className={styles.socialLabel}>Follow me</span>
                            <SocialLinks size="lg" />
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1} className={styles.side}>
                        {siteMeta.available && (
                            <div className={`glass-card ${styles.availability}`}>
                                <span className={styles.availDot} />
                                <div>
                                    <strong>Available for hire</strong>
                                    <p>Remote & hybrid · Full-time · Contract</p>
                                </div>
                            </div>
                        )}

                        <ContactForm />

                        <TiltCard className={styles.resumeCard}>
                            <div className={styles.resumeIcon}>
                                <FileText size={28} />
                            </div>
                            <h3>Download Resume</h3>
                            <p>Full experience, skills, certifications, and projects in one page.</p>
                            <a
                                href={resumeHtmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`btn btn-primary ${styles.dlBtn}`}
                                data-cursor="pointer"
                            >
                                <Download size={18} />
                                View HTML Resume
                            </a>
                            <div className={styles.dlRow}>
                                <a
                                    href={resumePdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download="Rihan-Mohammed-Resume.pdf"
                                    className={`btn btn-outline ${styles.dlBtnHalf}`}
                                    data-cursor="pointer"
                                >
                                    <FileText size={18} />
                                    PDF
                                </a>
                                <a
                                    href={resumeDocxUrl}
                                    download="Rihan-Mohammed-Resume.docx"
                                    className={`btn btn-outline ${styles.dlBtnHalf}`}
                                    data-cursor="pointer"
                                >
                                    <FileText size={18} />
                                    Word
                                </a>
                            </div>
                        </TiltCard>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
