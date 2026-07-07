"use client";

import { m } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { prefersReducedEffects } from "@/lib/device-capabilities";

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function FadeIn({ children, className = "", delay = 0 }: FadeInProps) {
    // Default to the static (no-animation) branch so SSR/first paint never
    // shows an opacity:0 element waiting on a client-only viewport check.
    const [reduceEffects, setReduceEffects] = useState(true);

    useEffect(() => {
        // prefersReducedEffects() reads window.matchMedia, which is unavailable
        // during the static build. Initialising to `true` (no animation) matches
        // the server HTML; this effect corrects the value post-hydration.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReduceEffects(prefersReducedEffects());
    }, []);

    if (reduceEffects) {
        return <div className={className}>{children}</div>;
    }

    return (
        <m.div
            className={className}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-32px" }}
            transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </m.div>
    );
}
