"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Box } from "lucide-react";
import { useEffect, useState } from "react";
import { isSceneEnabled, setSceneEnabled } from "@/lib/scene-preference";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [sceneOn, setSceneOn] = useState(false);

    useEffect(() => {
        // setMounted/setSceneOn are intentional post-hydration initializations —
        // they must read from localStorage (unavailable during SSR) and flip from
        // the server-safe default to the real client value without a mismatch.
        // setMounted/setSceneOn are intentional post-hydration initializations —
        // they read from localStorage (unavailable during SSR) so they cannot use
        // a lazy useState initializer without causing a hydration mismatch.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        setSceneOn(isSceneEnabled());
        // setState here is inside a callback (event handler), which is correct.
        const sync = () => setSceneOn(isSceneEnabled());
        window.addEventListener("scene-preference-change", sync);
        return () => window.removeEventListener("scene-preference-change", sync);
    }, []);

    if (!mounted) {
        return <button className={styles.toggle} aria-label="Toggle theme" />;
    }

    return (
        <div className={styles.group}>
            <button
                type="button"
                className={styles.toggle}
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
            >
                {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
                type="button"
                className={`${styles.toggle} ${sceneOn ? styles.sceneOn : ""}`}
                onClick={() => {
                    setSceneEnabled(!sceneOn);
                    window.location.reload();
                }}
                aria-label={sceneOn ? "Disable 3D background" : "Enable 3D background"}
                title={sceneOn ? "Disable 3D background" : "Enable 3D background"}
            >
                <Box size={18} />
            </button>
        </div>
    );
}
