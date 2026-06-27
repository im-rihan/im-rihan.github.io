"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail, ArrowUpRight, Terminal } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { siteMeta } from "@/data/profile";
import { navigateToSection } from "@/lib/scroll-to-section";
import styles from "./Navbar.module.css";

const pageLinks = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "Chat" },
    { href: "/github", label: "GitHub" },
    { href: "/gallery", label: "Gallery" },
    { href: "/status", label: "Analytics" },
];

const sectionLinks = [
    { id: "about", label: "About", file: "about.md" },
    { id: "skills", label: "Skills", file: "skills.json" },
    { id: "experience", label: "Experience", file: "experience.ts" },
    { id: "projects", label: "Projects", file: "projects/" },
    { id: "education", label: "Education", file: "education.md" },
    { id: "contact", label: "Contact", file: "contact.sh" },
];

function normalizePath(path: string): string {
    if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
    return path;
}

function NavLink({
    href,
    label,
    active,
    onClick,
}: {
    href: string;
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <Link
            href={href}
            className={`${styles.navLink} ${active ? styles.activeLink : ""}`}
            onClick={onClick}
            data-cursor="nav"
        >
            {active && <span className={styles.activePill} aria-hidden />}
            <span className={styles.navPrefix} aria-hidden>{">"}</span>
            <span className={styles.navLinkText}>{label}</span>
            <span className={styles.navUnderline} aria-hidden />
        </Link>
    );
}

export function Navbar() {
    const pathname = normalizePath(usePathname());
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [exploreOpen, setExploreOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const exploreRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
                setExploreOpen(false);
            }
        };
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
                setExploreOpen(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const closeAll = () => {
        setOpen(false);
        setExploreOpen(false);
    };

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

    useEffect(() => {
        closeAll();
    }, [pathname]);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    const goToSection = (id: string) => {
        closeAll();
        if (pathname === "/") {
            navigateToSection(id);
            return;
        }
        router.push(`/#${id}`);
    };

    return (
        <>
            {open && (
                <button
                    type="button"
                    className={styles.menuBackdrop}
                    aria-label="Close menu"
                    onClick={closeAll}
                />
            )}
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${open ? styles.menuOpenState : ""}`} data-cursor="nav">
            <div className={styles.scanBar} aria-hidden />
            <div className={styles.inner}>
                <Logo onNavigate={closeAll} />

                <div className={styles.navCenter}>
                    <ul className={`${styles.links} ${open ? styles.open : ""}`}>
                        {pageLinks.map((link) => (
                            <li key={link.href}>
                                <NavLink
                                    href={link.href}
                                    label={link.label}
                                    active={isActive(link.href)}
                                    onClick={closeAll}
                                />
                            </li>
                        ))}
                        <li className={styles.exploreItem} ref={exploreRef}>
                            <button
                                type="button"
                                className={`${styles.exploreBtn} ${exploreOpen ? styles.exploreOpen : ""}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExploreOpen(!exploreOpen);
                                }}
                                aria-expanded={exploreOpen}
                                aria-haspopup="true"
                                data-cursor="nav"
                            >
                                <span className={styles.navPrefix} aria-hidden>{">"}</span>
                                <span className={styles.navLinkText}>Sections</span>
                                <ChevronDown size={14} className={styles.chevron} />
                                <span className={styles.navUnderline} aria-hidden />
                            </button>

                            <AnimatePresence>
                                {exploreOpen && (
                                    <motion.div
                                        className={styles.dropdownWrap}
                                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <div className={styles.dropdown} role="menu">
                                            <div className={styles.dropdownHeader}>
                                                <div className={styles.windowDots}>
                                                    <span className={styles.dotRed} />
                                                    <span className={styles.dotYellow} />
                                                    <span className={styles.dotGreen} />
                                                </div>
                                                <Terminal size={13} />
                                                <code>~/portfolio/sections</code>
                                            </div>
                                            <p className={styles.dropdownCmd}>
                                                <span className={styles.prompt}>$</span> ls -la sections/
                                            </p>
                                            <div className={styles.dropdownGrid}>
                                                {sectionLinks.map((link, i) => (
                                                    <motion.button
                                                        key={link.id}
                                                        type="button"
                                                        role="menuitem"
                                                        className={styles.dropdownItem}
                                                        onClick={() => goToSection(link.id)}
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.04 }}
                                                        data-cursor="nav"
                                                    >
                                                        <span className={styles.itemIndex}>
                                                            {String(i + 1).padStart(2, "0")}
                                                        </span>
                                                        <span className={styles.itemBody}>
                                                            <span className={styles.itemLabel}>{link.label}</span>
                                                            <span className={styles.itemFile}>{link.file}</span>
                                                        </span>
                                                        <ArrowUpRight size={14} className={styles.itemArrow} />
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </li>
                    </ul>
                </div>

                <div className={styles.actions}>
                    <a
                        href={`mailto:${siteMeta.email}`}
                        className={styles.contactCta}
                        data-cursor="pointer"
                    >
                        <Mail size={16} />
                        <span className={styles.contactLabel}>Contact</span>
                    </a>
                    <ThemeToggle />
                    <button
                        type="button"
                        className={`${styles.menuBtn} ${open ? styles.menuOpen : ""}`}
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle menu"
                        aria-expanded={open}
                        data-cursor="pointer"
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </div>
        </nav>
        </>
    );
}
