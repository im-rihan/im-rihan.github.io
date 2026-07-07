"use client";

import { m, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { prefersReducedEffects } from "@/lib/device-capabilities";

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function FadeIn({ children, className = "", delay = 0 }: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null);
    // Default to the static (no-animation) branch so SSR/first paint never
    // shows an opacity:0 element waiting on a client-only viewport check.
    const [reduceEffects, setReduceEffects] = useState(true);
    // once:false so returning to the homepage re-triggers visibility after remount.
    const isInView = useInView(ref, { once: false, margin: "-32px 0px -32px 0px", amount: 0.01 });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReduceEffects(prefersReducedEffects());
    }, []);

    if (reduceEffects) {
        return <div className={className}>{children}</div>;
    }

    return (
        <m.div
            ref={ref}
            className={className}
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </m.div>
    );
}
