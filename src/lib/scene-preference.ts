import { isLowMemoryDevice, isWebGLAvailable } from "@/lib/browser-capabilities";

const SCENE_KEY = "portfolio-scene-opt-in";
const LEGACY_KEY = "portfolio-scene-enabled";

export function isSceneEnabled(): boolean {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (!isWebGLAvailable()) return false;
    if (isLowMemoryDevice()) return false;
    // Forget the previous key so an old "on" value cannot override the default.
    if (localStorage.getItem(LEGACY_KEY) !== null) {
        localStorage.removeItem(LEGACY_KEY);
    }
    // Off unless the visitor explicitly opts in from the toggle or command palette.
    return localStorage.getItem(SCENE_KEY) === "true";
}

export function setSceneEnabled(enabled: boolean): void {
    localStorage.setItem(SCENE_KEY, String(enabled));
    window.dispatchEvent(new CustomEvent("scene-preference-change"));
}

export function shouldLoadScene(pathname: string): boolean {
    if (pathname.startsWith("/status")) return false;
    if (typeof window !== "undefined" && !isWebGLAvailable()) return false;
    return isSceneEnabled();
}
