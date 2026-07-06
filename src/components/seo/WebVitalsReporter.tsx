"use client";

import { useEffect } from "react";
import { startWebVitalsReporting } from "@/lib/web-vitals-report";

/** Mounted once in the root layout — starts Core Web Vitals collection for every page. */
export function WebVitalsReporter() {
    useEffect(() => {
        startWebVitalsReporting();
    }, []);
    return null;
}
