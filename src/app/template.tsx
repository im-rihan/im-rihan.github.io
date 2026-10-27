"use client";

/// <reference types="react/canary" />

import { type ReactNode, ViewTransition } from "react";

/** Remounts on every navigation so enter/exit fire. default="none" skips inner updates. */
export default function Template({ children }: { children: ReactNode }) {
    return (
        <ViewTransition enter="page-enter" exit="page-exit" default="none">
            {children}
        </ViewTransition>
    );
}
