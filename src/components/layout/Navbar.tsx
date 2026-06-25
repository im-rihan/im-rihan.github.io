"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Navbar.module.css";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "Chat" },
    { href: "/github", label: "GitHub" },
    { href: "/gallery", label: "Gallery" },
    { href: "/status", label: "Analytics" },
];

function normalizePath(path: string): string {
    if (path.length > 1 && path.endsWith("/")) {
        return path.slice(0, -1);
    }
    return path;
}

export function Navbar() {
    const pathname = normalizePath(usePathname());
    const [open, setOpen] = useState(false);

    return (
        <nav className={styles.navbar}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
                    RM.
                </Link>
                <ul className={`${styles.links} ${open ? styles.open : ""}`}>
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={
                                    pathname === link.href ||
                                    (link.href !== "/" && pathname.startsWith(link.href))
                                        ? styles.active
                                        : undefined
                                }
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    <li className={styles.themeItem}>
                        <ThemeToggle />
                    </li>
                </ul>
                <button
                    type="button"
                    className={styles.menuBtn}
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? "✕" : "☰"}
                </button>
            </div>
        </nav>
    );
}
