/**
 * True on touch-first devices (phones, tablets) where hover never fires and
 * pointer precision is coarse. Width-based media queries alone miss large
 * tablets like iPad/Redmi Pad Pro in landscape, which are wider than typical
 * "mobile" breakpoints but still touch-only — leaving them stuck with
 * mouse-driven 3D tilt and backdrop-filter effects that some Android GPUs
 * fail to composite correctly during scroll (rendering blank "skeleton"
 * cards with misplaced shadows).
 */
export function prefersReducedEffects(): boolean {
    if (typeof window === "undefined") return true;
    return (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(hover: none)").matches ||
        window.matchMedia("(pointer: coarse)").matches
    );
}
