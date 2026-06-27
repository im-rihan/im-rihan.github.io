/** Page scroll progress 0–1 for 3D parallax (smoothed, not raw scrollY). */
let targetProgress = 0;
let displayProgress = 0;

export function getScrollProgress() {
    return displayProgress;
}

function readTargetProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    targetProgress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

/** Call each frame from the R3F loop to avoid parallax jitter during smooth scroll. */
export function advanceScrollProgress(delta: number) {
    const blend = 1 - Math.exp(-5.5 * delta);
    displayProgress += (targetProgress - displayProgress) * blend;
}

export function bindSceneScrollTracker(): () => void {
    readTargetProgress();
    displayProgress = targetProgress;

    const onScroll = () => readTargetProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
    };
}
