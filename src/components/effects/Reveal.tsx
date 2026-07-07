import type { CSSProperties, ReactNode } from "react";

interface RevealProps {
    children: ReactNode;
    className?: string;
    /** Stagger delay in seconds (scroll-driven animation). */
    delay?: number;
}

/** Server-safe scroll reveal — CSS `animation-timeline: view()` with no JS hydration. */
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
    const style: CSSProperties | undefined =
        delay > 0 ? { animationDelay: `${delay}s` } : undefined;

    return (
        <div className={className ? `reveal ${className}` : "reveal"} style={style}>
            {children}
        </div>
    );
}
