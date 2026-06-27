"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { bindSceneScrollTracker } from "@/lib/scene-scroll";
import { sceneWrapperOpacity } from "./scene-viewport";
import styles from "./Scene3D.module.css";

const SceneCanvas = dynamic(() => import("./SceneCanvas").then((m) => m.SceneCanvas), {
    ssr: false,
    loading: () => null,
});

export function Scene3D() {
    const hostRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);
    const opacityRef = useRef(0.92);

    useEffect(() => {
        setReady(true);
    }, []);

    useEffect(() => bindSceneScrollTracker(), []);

    const handleViewportFrame = useCallback((snapshot: { mobileBlend: number }) => {
        const el = hostRef.current;
        if (!el) return;
        const isLight = document.documentElement.classList.contains("light");
        const next = sceneWrapperOpacity(snapshot.mobileBlend, isLight);
        if (Math.abs(opacityRef.current - next) < 0.001) return;
        opacityRef.current = next;
        el.style.opacity = String(next);
    }, []);

    return (
        <div ref={hostRef} className={styles.wrapper} aria-hidden>
            {ready && hostRef.current ? (
                <SceneCanvas container={hostRef.current} onViewportFrame={handleViewportFrame} />
            ) : null}
        </div>
    );
}
