"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import styles from "./PwaInstallHint.module.css";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "portfolio-pwa-hint-dismissed";

export function PwaInstallHint() {
    const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (localStorage.getItem(DISMISS_KEY) === "1") return;
        if (window.matchMedia("(display-mode: standalone)").matches) return;

        const onBeforeInstall = (event: Event) => {
            event.preventDefault();
            setDeferred(event as BeforeInstallPromptEvent);
            setVisible(true);
        };

        window.addEventListener("beforeinstallprompt", onBeforeInstall);
        return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    }, []);

    const dismiss = () => {
        localStorage.setItem(DISMISS_KEY, "1");
        setVisible(false);
        setDeferred(null);
    };

    const install = async () => {
        if (!deferred) return;
        await deferred.prompt();
        await deferred.userChoice;
        dismiss();
    };

    if (!visible || !deferred) return null;

    return (
        <div className={styles.banner} role="region" aria-label="Install app">
            <Download size={18} aria-hidden />
            <p>
                Install this portfolio for quick access from your home screen.
            </p>
            <button type="button" className={styles.install} onClick={install}>
                Install
            </button>
            <button type="button" className={styles.close} onClick={dismiss} aria-label="Dismiss install hint">
                <X size={16} />
            </button>
        </div>
    );
}
