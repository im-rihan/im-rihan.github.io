"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MessageCircle, X, ChevronUp } from "lucide-react";
import { siteMeta } from "@/data/profile";
import { SectionScrollLink } from "@/components/layout/SectionScrollLink";
import { SocialLinks } from "@/components/ui/SocialLinks";
import styles from "./ContactDock.module.css";

const quickLinks = [
    { label: "Email", href: `mailto:${siteMeta.email}`, icon: Mail },
    { label: "Call", href: `tel:${siteMeta.phone.replace(/\s/g, "")}`, icon: Phone },
];

export function ContactDock() {
    const [open, setOpen] = useState(false);

    return (
        <div className={`${styles.dock} ${open ? styles.open : ""}`}>
            <div className={styles.panel} aria-hidden={!open}>
                <div className={styles.panelHead}>
                    <div>
                        <strong>Get in touch</strong>
                        <p>Available for hire · replies within 24–48h</p>
                    </div>
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={() => setOpen(false)}
                        aria-label="Close contact panel"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className={styles.quickRow}>
                    {quickLinks.map(({ label, href, icon: Icon }) => (
                        <a key={label} href={href} className={styles.quickBtn} data-cursor="pointer">
                            <Icon size={16} />
                            {label}
                        </a>
                    ))}
                    <SectionScrollLink
                        sectionId="contact"
                        className={styles.quickBtn}
                        onClick={() => setOpen(false)}
                        data-cursor="pointer"
                    >
                        Full contact
                    </SectionScrollLink>
                    <Link href="/chat" className={styles.quickBtn} onClick={() => setOpen(false)} data-cursor="pointer">
                        <MessageCircle size={16} />
                        Chat
                    </Link>
                </div>
                <div className={styles.socialRow}>
                    <SocialLinks size="sm" />
                </div>
            </div>
            <button
                type="button"
                className={styles.fab}
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-label={open ? "Close contact options" : "Open contact options"}
                data-cursor="pointer"
            >
                {open ? <ChevronUp size={22} /> : <Mail size={22} />}
                {!open && <span className={styles.fabPulse} aria-hidden />}
            </button>
        </div>
    );
}
