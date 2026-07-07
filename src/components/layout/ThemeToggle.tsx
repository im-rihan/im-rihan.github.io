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
        // SSR hydration guard — setMounted reveals the real UI only after the
        // client has taken over, preventing a flash of mismatched server HTML.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        // Reads localStorage, so must run post-mount; the listener keeps state
        // in sync whenever the user toggles the 3D scene.
        setSceneOn(isSceneEnabled());
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
