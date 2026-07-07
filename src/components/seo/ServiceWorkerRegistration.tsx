"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
    useEffect(() => {
        if (process.env.NODE_ENV !== "production") return;
        if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

        const register = () => {
            navigator.serviceWorker.register("/sw.js").catch(() => {
                /* non-critical — page still works without it */
            });
        };

        // Register after the page has finished loading so it never competes with
        // the initial render/hydration for the network or main thread.
        window.addEventListener("load", register);
        return () => window.removeEventListener("load", register);
    }, []);

    return null;
}
