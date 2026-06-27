"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { readIsLightTheme } from "@/lib/scene-theme";

/** Syncs with next-themes and html.light class for instant R3F updates. */
export function useIsLightTheme() {
    const { resolvedTheme } = useTheme();
    const [isLight, setIsLight] = useState(false);

    useEffect(() => {
        const sync = () => setIsLight(readIsLightTheme());
        sync();

        const observer = new MutationObserver(sync);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, [resolvedTheme]);

    return isLight;
}
