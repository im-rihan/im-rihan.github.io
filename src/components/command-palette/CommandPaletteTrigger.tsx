"use client";

import { Search } from "lucide-react";
import { OPEN_COMMAND_PALETTE_EVENT } from "./CommandPaletteLauncher";
import styles from "./CommandPaletteTrigger.module.css";

/** Small discoverability hint — the palette itself opens from anywhere via ⌘K/Ctrl+K. */
export function CommandPaletteTrigger() {
    const isMac =
        typeof navigator !== "undefined" && /Mac|iPhone|iPod|iPad/.test(navigator.platform ?? navigator.userAgent);

    return (
        <button
            type="button"
            className={styles.trigger}
            onClick={() => window.dispatchEvent(new CustomEvent(OPEN_COMMAND_PALETTE_EVENT))}
            data-cursor="pointer"
        >
            <Search size={13} aria-hidden />
            <span>Jump anywhere</span>
            <kbd>{isMac ? "⌘" : "Ctrl"} K</kbd>
        </button>
    );
}
