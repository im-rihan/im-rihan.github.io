import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";

export type Vec3 = [number, number, number];

export type ViewportSnapshot = {
    width: number;
    height: number;
    aspect: number;
    mobileBlend: number;
    mobileTarget: number;
    isAnimating: boolean;
};

export type ViewportRef = RefObject<ViewportSnapshot>;

export function createViewportSnapshot(): ViewportSnapshot {
    return {
        width: typeof window !== "undefined" ? window.innerWidth : 1280,
        height: typeof window !== "undefined" ? window.innerHeight : 800,
        aspect: 1.6,
        mobileBlend: 0,
        mobileTarget: 0,
        isAnimating: false,
    };
}

export function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
    return [
        THREE.MathUtils.lerp(a[0], b[0], t),
        THREE.MathUtils.lerp(a[1], b[1], t),
        THREE.MathUtils.lerp(a[2], b[2], t),
    ];
}

export function smoothStep(current: number, target: number, delta: number, smoothness = 4.8): number {
    const factor = 1 - Math.exp(-smoothness * delta);
    return THREE.MathUtils.lerp(current, target, factor);
}

/** Typical iOS/Android address-bar show/hide height delta — used to tell a
 *  real layout resize apart from mobile browser chrome animating during scroll. */
const CHROME_SHIFT_THRESHOLD = 120;
/** Wait for the browser chrome height animation to settle before recomputing
 *  camera-affecting aspect ratio — avoids re-framing the 3D scene mid-scroll. */
const CHROME_SHIFT_SETTLE_MS = 220;

export function useViewportTracker(
    container: HTMLElement | null,
    onTargetChange?: (mobileTarget: number) => void
): ViewportRef {
    const ref = useRef<ViewportSnapshot>(createViewportSnapshot());
    const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevTarget = useRef(-1);
    const lastAppliedRef = useRef({ width: 0, height: 0 });

    useEffect(() => {
        if (!container) return;

        const mq = window.matchMedia("(max-width: 768px)");

        const commit = (w: number, h: number) => {
            const snap = ref.current;
            snap.width = w;
            snap.height = h;
            snap.aspect = w / Math.max(h, 1);
            snap.mobileTarget = mq.matches ? 1 : 0;
            snap.isAnimating = true;
            lastAppliedRef.current = { width: w, height: h };

            if (prevTarget.current !== snap.mobileTarget) {
                prevTarget.current = snap.mobileTarget;
                onTargetChange?.(snap.mobileTarget);
            }

            if (settleRef.current) clearTimeout(settleRef.current);
            settleRef.current = setTimeout(() => {
                snap.isAnimating = false;
            }, 520);

            // Only notify other viewport-driven trackers (scroll progress, cursor
            // canvas sizing) once a change has actually settled — not on every
            // micro-tick while mobile browser chrome is animating.
            window.dispatchEvent(new Event("resize"));
        };

        const apply = (immediate = false) => {
            const w = window.visualViewport?.width ?? window.innerWidth;
            const h = window.visualViewport?.height ?? window.innerHeight;
            const { width: lastW, height: lastH } = lastAppliedRef.current;

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }

            const widthChanged = Math.abs(w - lastW) > 1;
            const heightDelta = Math.abs(h - lastH);
            const looksLikeChromeShift =
                !immediate && !widthChanged && heightDelta > 0 && heightDelta < CHROME_SHIFT_THRESHOLD;

            if (immediate || widthChanged || heightDelta >= CHROME_SHIFT_THRESHOLD) {
                commit(w, h);
                return;
            }

            if (looksLikeChromeShift) {
                debounceRef.current = setTimeout(() => commit(w, h), CHROME_SHIFT_SETTLE_MS);
                return;
            }

            commit(w, h);
        };

        const onResizeObserved = () => apply();
        const onMqChange = () => apply(true);
        const onVisualViewportResize = () => apply();
        const onOrientationChange = () => apply(true);

        const ro = new ResizeObserver(onResizeObserved);
        ro.observe(container);
        mq.addEventListener("change", onMqChange);
        window.visualViewport?.addEventListener("resize", onVisualViewportResize);
        window.addEventListener("orientationchange", onOrientationChange);
        apply(true);

        return () => {
            ro.disconnect();
            mq.removeEventListener("change", onMqChange);
            window.visualViewport?.removeEventListener("resize", onVisualViewportResize);
            window.removeEventListener("orientationchange", onOrientationChange);
            if (settleRef.current) clearTimeout(settleRef.current);
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [container]);

    return ref;
}

/** CSS wrapper opacity for dark theme (desktop ↔ mobile). */
export function sceneWrapperOpacity(mobileBlend: number, isLight: boolean): number {
    if (isLight) {
        return THREE.MathUtils.lerp(0.55, 0.48, mobileBlend);
    }
    return THREE.MathUtils.lerp(0.92, 0.72, mobileBlend);
}
