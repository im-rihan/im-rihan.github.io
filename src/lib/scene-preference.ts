const SCENE_KEY = "portfolio-scene-enabled";

export function isSceneEnabled(): boolean {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    const stored = localStorage.getItem(SCENE_KEY);
    if (stored === "false") return false;
    if (stored === "true") return true;
    // Off by default: the 3D background is opt-in via the toggle button
    // since it's the single heaviest contributor to page load/scroll cost.
    return false;
}

export function setSceneEnabled(enabled: boolean): void {
    localStorage.setItem(SCENE_KEY, String(enabled));
    window.dispatchEvent(new CustomEvent("scene-preference-change"));
}

export function shouldLoadScene(pathname: string): boolean {
    if (pathname.startsWith("/status")) return false;
    return isSceneEnabled();
}
