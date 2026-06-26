"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return <button className={styles.toggle} aria-label="Toggle theme" />;
    }

    return (
        <button
            type="button"
            className={styles.toggle}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
