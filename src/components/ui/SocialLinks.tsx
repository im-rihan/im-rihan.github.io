"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { siteMeta } from "@/data/profile";
import styles from "./SocialLinks.module.css";

function XIcon({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

export const socialItems = [
    {
        id: "github",
        href: siteMeta.github,
        label: "GitHub",
        Icon: Github,
        external: true,
    },
    {
        id: "linkedin",
        href: siteMeta.linkedin,
        label: "LinkedIn",
        Icon: Linkedin,
        external: true,
    },
    {
        id: "twitter",
        href: siteMeta.twitter,
        label: "X (Twitter)",
        Icon: XIcon,
        external: true,
    },
    {
        id: "email",
        href: `mailto:${siteMeta.email}`,
        label: "Email",
        Icon: Mail,
        external: false,
    },
] as const;

interface SocialLinksProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function SocialLinks({ size = "md", className = "" }: SocialLinksProps) {
    return (
        <div className={`${styles.row} ${styles[size]} ${className}`} role="list">
            {socialItems.map(({ id, href, label, Icon, external }) => (
                <a
                    key={id}
                    href={href}
                    className={`${styles.link} ${styles[id]}`}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    aria-label={label}
                    data-cursor="pointer"
                    role="listitem"
                >
                    <span className={styles.iconWrap}>
                        <Icon size={size === "sm" ? 16 : size === "lg" ? 22 : 18} />
                    </span>
                    <span className={styles.tooltip}>{label}</span>
                </a>
            ))}
        </div>
    );
}
