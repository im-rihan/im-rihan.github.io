import type { ReactNode } from "react";

interface RevealProps {
    children: ReactNode;
    className?: string;
    /** Reserved for API compatibility — scroll reveal removed (SPA-safe). */
    delay?: number;
}

/** Layout wrapper for page content — no opacity enter/exit (breaks SPA return to home). */
export function Reveal({ children, className = "" }: RevealProps) {
    return <div className={className}>{children}</div>;
}
