"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type IdleWindow = typeof window & {
    requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
    cancelIdleCallback?: (handle: number) => void;
};

export function VisitorTracker() {
    const pathname = usePathname();

    useEffect(() => {
        const win = window as IdleWindow;
        let cancelled = false;

        // Analytics has no visual output, so it's deferred to idle time (same
        // pattern as the 3D scene) — this keeps the Supabase client's dynamic
        // import from competing with the initial page paint/hydration.
        const run = () => {
            if (cancelled) return;
            import("@/lib/visitor-analytics").then(({ trackVisit }) => trackVisit(pathname || "/"));
        };

        if (typeof win.requestIdleCallback === "function") {
            const handle = win.requestIdleCallback(run, { timeout: 2000 });
            return () => {
                cancelled = true;
                win.cancelIdleCallback?.(handle);
            };
        }

        const timeout = window.setTimeout(run, 300);
        return () => {
            cancelled = true;
            window.clearTimeout(timeout);
        };
    }, [pathname]);

    return null;
}
