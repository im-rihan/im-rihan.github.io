"use client";

import { type ReactNode } from "react";

interface FadeInProps {
    children: ReactNode;
    className?: string;
    /** Kept for call-site compatibility — animations removed for SPA reliability. */
    delay?: number;
}

/** Always-visible wrapper. Opacity-based scroll reveals break client navigation back to home. */
export function FadeIn({ children, className = "" }: FadeInProps) {
    return <div className={className}>{children}</div>;
}
