"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackVisit } from "@/lib/visitor-analytics";

export function VisitorTracker() {
    const pathname = usePathname();

    useEffect(() => {
        trackVisit(pathname || "/");
    }, [pathname]);

    return null;
}
