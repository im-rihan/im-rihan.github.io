"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

interface MagneticProps {
    children: ReactNode;
    className?: string;
    /** How far the target follows the cursor. 0.25–0.35 reads as craft, not a toy. */
    strength?: number;
}

function useFinePointer() {
    const [fine, setFine] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
        const sync = () => setFine(mq.matches);
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    return fine;
}

/** Desktop hire/contact pull. No-ops on touch, coarse pointers, and reduced motion. */
export function Magnetic({ children, className = "", strength = 0.28 }: MagneticProps) {
    const reduce = useReducedMotion();
    const fine = useFinePointer();
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 320, damping: 24, mass: 0.35 });
    const springY = useSpring(y, { stiffness: 320, damping: 24, mass: 0.35 });

    if (reduce || !fine) {
        return (
            <div className={className} style={{ display: "inline-flex" }}>
                {children}
            </div>
        );
    }

    const onMove = (event: MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        x.set((event.clientX - (box.left + box.width / 2)) * strength);
        y.set((event.clientY - (box.top + box.height / 2)) * strength);
    };

    const onLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <m.div
            ref={ref}
            className={className}
            style={{ x: springX, y: springY, display: "inline-flex" }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
        >
            {children}
        </m.div>
    );
}
