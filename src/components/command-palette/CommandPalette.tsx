"use client";

import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
    Home,
    Briefcase,
    Newspaper,
    MessageSquare,
    Github,
    Images,
    Activity,
    User,
    Wrench,
    Layers,
    FolderGit2,
    Quote,
    GraduationCap,
    Mail,
    Sun,
    Moon,
    Box,
    Copy,
    FileDown,
    Linkedin,
    type LucideIcon,
} from "lucide-react";
import { siteMeta } from "@/data/profile";
import { navigateToSection } from "@/lib/scroll-to-section";
import { isSceneEnabled, setSceneEnabled } from "@/lib/scene-preference";
import styles from "./CommandPalette.module.css";

interface PaletteItem {
    id: string;
    label: string;
    group: "Pages" | "Sections" | "Actions";
    hint?: string;
    keywords?: string;
    icon: LucideIcon;
    perform: () => void;
}

export function CommandPalette({ onClose }: { onClose: () => void }) {
    const router = useRouter();
    const pathname = usePathname();
    const { resolvedTheme, setTheme } = useTheme();
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const listId = useId();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const goToSection = (id: string) => {
        if (pathname === "/") {
            navigateToSection(id);
        } else {
            router.push(`/#${id}`);
        }
    };

    const items = useMemo<PaletteItem[]>(() => {
        const pages: PaletteItem[] = [
            { id: "page-home", label: "Home", group: "Pages", icon: Home, perform: () => router.push("/") },
            { id: "page-work", label: "Work / Case Studies", group: "Pages", icon: Briefcase, perform: () => router.push("/work") },
            { id: "page-blog", label: "Blog", group: "Pages", icon: Newspaper, perform: () => router.push("/blog") },
            { id: "page-chat", label: "Chat", group: "Pages", icon: MessageSquare, perform: () => router.push("/chat") },
            { id: "page-github", label: "GitHub Activity", group: "Pages", icon: Github, perform: () => router.push("/github") },
            { id: "page-gallery", label: "Gallery", group: "Pages", icon: Images, perform: () => router.push("/gallery") },
            { id: "page-status", label: "Analytics / Status", group: "Pages", icon: Activity, perform: () => router.push("/status") },
        ];

        const sections: PaletteItem[] = [
            { id: "sec-about", label: "About", group: "Sections", icon: User, perform: () => goToSection("about") },
            { id: "sec-skills", label: "Skills", group: "Sections", icon: Wrench, perform: () => goToSection("skills") },
            { id: "sec-experience", label: "Experience", group: "Sections", icon: Layers, perform: () => goToSection("experience") },
            { id: "sec-projects", label: "Projects", group: "Sections", icon: FolderGit2, perform: () => goToSection("projects") },
            { id: "sec-testimonials", label: "Testimonials", group: "Sections", icon: Quote, perform: () => goToSection("testimonials") },
            { id: "sec-education", label: "Education", group: "Sections", icon: GraduationCap, perform: () => goToSection("education") },
            { id: "sec-contact", label: "Contact", group: "Sections", icon: Mail, perform: () => goToSection("contact") },
        ];

        const isDark = resolvedTheme === "dark";
        const sceneOn = isSceneEnabled();

        const actions: PaletteItem[] = [
            {
                id: "action-theme",
                label: isDark ? "Switch to light theme" : "Switch to dark theme",
                group: "Actions",
                hint: "Theme",
                keywords: "dark light mode appearance",
                icon: isDark ? Sun : Moon,
                perform: () => setTheme(isDark ? "light" : "dark"),
            },
            {
                id: "action-scene",
                label: sceneOn ? "Disable 3D background" : "Enable 3D background",
                group: "Actions",
                hint: "Visual",
                keywords: "three js webgl scene background",
                icon: Box,
                perform: () => {
                    setSceneEnabled(!sceneOn);
                    window.location.reload();
                },
            },
            {
                id: "action-copy-email",
                label: copied ? "Email copied!" : "Copy email address",
                group: "Actions",
                hint: siteMeta.email,
                keywords: "contact mail",
                icon: Copy,
                perform: () => {
                    navigator.clipboard?.writeText(siteMeta.email).then(() => setCopied(true));
                },
            },
            {
                id: "action-resume",
                label: "Download resume (PDF)",
                group: "Actions",
                hint: "Download",
                keywords: "cv resume download pdf",
                icon: FileDown,
                perform: () => {
                    window.open("/resume.pdf", "_blank");
                },
            },
            {
                id: "action-github",
                label: "Open GitHub profile",
                group: "Actions",
                hint: "External",
                keywords: "github profile source code",
                icon: Github,
                perform: () => window.open(siteMeta.github, "_blank", "noopener,noreferrer"),
            },
            {
                id: "action-linkedin",
                label: "Open LinkedIn profile",
                group: "Actions",
                hint: "External",
                keywords: "linkedin profile",
                icon: Linkedin,
                perform: () => window.open(siteMeta.linkedin, "_blank", "noopener,noreferrer"),
            },
        ];

        return [...pages, ...sections, ...actions];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, pathname, resolvedTheme, copied]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((item) =>
            `${item.label} ${item.keywords ?? ""} ${item.group}`.toLowerCase().includes(q)
        );
    }, [items, query]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    const run = (item: PaletteItem) => {
        item.perform();
        if (item.id === "action-copy-email") {
            window.setTimeout(onClose, 500);
            return;
        }
        onClose();
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const item = filtered[activeIndex];
            if (item) run(item);
        } else if (e.key === "Escape") {
            onClose();
        }
    };

    let lastGroup: string | null = null;

    return (
        // The backdrop is a mouse-only convenience for dismissing the palette — the
        // real keyboard equivalent is the Escape handler on the search input plus
        // focus trapping via autofocus, so no keyboard listener belongs here.
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div className={styles.backdrop} onClick={onClose}>
            {/* This click handler only stops backdrop-close propagation for clicks
                inside the panel — it's not a real interactive control, so no
                keyboard listener applies here either. */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
            <div
                className={styles.panel}
                role="dialog"
                aria-modal="true"
                aria-label="Command palette"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <span className={styles.prompt}>&gt;</span>
                    <input
                        ref={inputRef}
                        className={styles.input}
                        role="combobox"
                        aria-expanded="true"
                        aria-controls={listId}
                        aria-autocomplete="list"
                        aria-activedescendant={filtered[activeIndex] ? `${listId}-${filtered[activeIndex].id}` : undefined}
                        placeholder="Search pages, sections, actions…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={onKeyDown}
                    />
                    <span className={styles.escHint}>ESC</span>
                </div>

                {filtered.length === 0 ? (
                    <p className={styles.empty}>No matches for &ldquo;{query}&rdquo;</p>
                ) : (
                    <ul className={styles.results} id={listId} role="listbox">
                        {filtered.map((item, i) => {
                            const showGroupLabel = item.group !== lastGroup;
                            lastGroup = item.group;
                            const Icon = item.icon;
                            return (
                                <Fragment key={item.id}>
                                    {showGroupLabel && (
                                        <li className={styles.groupLabel} role="presentation">
                                            {item.group}
                                        </li>
                                    )}
                                    {/* Keyboard selection is handled by the search input's onKeyDown
                                        (Arrow keys move activeIndex, Enter runs the item) via the ARIA
                                        combobox/listbox pattern — options are "virtually focused" through
                                        aria-activedescendant rather than real DOM focus, so tabIndex={-1}
                                        keeps them out of the tab order while still satisfying
                                        interactive-supports-focus; no separate keyboard listener belongs
                                        on the option itself. */}
                                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                                    <li
                                        id={`${listId}-${item.id}`}
                                        role="option"
                                        tabIndex={-1}
                                        aria-selected={i === activeIndex}
                                        className={`${styles.item} ${i === activeIndex ? styles.itemActive : ""}`}
                                        onMouseEnter={() => setActiveIndex(i)}
                                        onClick={() => run(item)}
                                    >
                                        <Icon size={16} aria-hidden />
                                        <span className={styles.itemLabel}>{item.label}</span>
                                        {item.hint && <span className={styles.itemHint}>{item.hint}</span>}
                                    </li>
                                </Fragment>
                            );
                        })}
                    </ul>
                )}

                <div className={styles.footer}>
                    <span><kbd>↑↓</kbd>navigate</span>
                    <span><kbd>↵</kbd>select</span>
                    <span><kbd>esc</kbd>close</span>
                </div>
            </div>
        </div>
    );
}
