"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToSection } from "@/lib/scroll-to-section";

function normalizePath(path: string): string {
    if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
    return path;
}

export function HashScrollHandler() {
    const pathname = normalizePath(usePathname());

    useEffect(() => {
        if (pathname !== "/") return;

        const scrollToHash = (behavior: ScrollBehavior = "smooth") => {
            const hash = window.location.hash.replace(/^#/, "");
            if (hash) scrollToSection(hash, behavior);
        };

        const raf = requestAnimationFrame(() => scrollToHash("auto"));

        const onHashChange = () => scrollToHash("smooth");

        window.addEventListener("hashchange", onHashChange);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("hashchange", onHashChange);
        };
    }, [pathname]);

    return null;
}
