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
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [ready, setReady] = useState(false);
    const opacityRef = useRef(0.92);

    useEffect(() => {
        if (ready) return;

        let mounted = true;
        const activate = () => {
            if (mounted) setReady(true);
            cleanup();
        };

        const onScroll = () => {
            if (window.scrollY > 80) activate();
        };

        let fallbackId = 0;

        const cleanup = () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("pointerdown", activate);
            window.removeEventListener("keydown", activate);
            if (fallbackId) window.clearTimeout(fallbackId);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("pointerdown", activate, { once: true });
        window.addEventListener("keydown", activate, { once: true });
        fallbackId = window.setTimeout(activate, 8000);

        return () => {
            mounted = false;
            cleanup();
        };
    }, [ready]);

    useEffect(() => bindSceneScrollTracker(), []);

    const handleViewportFrame = useCallback((snapshot: { mobileBlend: number }) => {
        if (!container) return;
        const isLight = document.documentElement.classList.contains("light");
        const next = sceneWrapperOpacity(snapshot.mobileBlend, isLight);
        if (Math.abs(opacityRef.current - next) < 0.001) return;
        opacityRef.current = next;
        container.style.opacity = String(next);
    }, [container]);

    return (
        <div ref={setContainer} className={styles.wrapper} aria-hidden>
            {ready && container ? (
                <SceneCanvas container={container} onViewportFrame={handleViewportFrame} />
            ) : null}
        </div>
    );
}
