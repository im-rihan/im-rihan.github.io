/** Shared dark/light palette for R3F scene layers. */
export type SceneTheme = {
    primary: string;
    primaryDark: string;
    accent: string;
    accentSoft: string;
    muted: string;
    warm: string;
    purple: string;
    fog: string;
    core: string;
    coreEmissive: string;
    sparkle: string;
    sparkleFine: string;
    star: string;
    gridCell: string;
    gridSection: string;
    wire: { outer: number; inner: number; ring: number; shell: number; shellEmissive: number };
    particle: number;
    nebula: number;
    hex: number;
    orbit: [number, number, number];
    arcMuted: string;
    ribbon: string[];
    orb: string[];
};

export function getSceneTheme(isLight: boolean): SceneTheme {
    if (isLight) {
        return {
            primary: "#0d9488",
            primaryDark: "#0f766e",
            accent: "#0891b2",
            accentSoft: "#06b6d4",
            muted: "#64748b",
            warm: "#d97706",
            purple: "#6366f1",
            fog: "#eef2f7",
            core: "#0d9488",
            coreEmissive: "#0891b2",
            sparkle: "#0d9488",
            sparkleFine: "#94a3b8",
            star: "#64748b",
            gridCell: "#0d9488",
            gridSection: "#14b8a6",
            wire: { outer: 0.2, inner: 0.09, ring: 0.12, shell: 0.045, shellEmissive: 0.08 },
            particle: 0.4,
            nebula: 0.012,
            hex: 0.07,
            orbit: [0.24, 0.14, 0.07],
            arcMuted: "#94a3b8",
            ribbon: ["#0d9488", "#6366f1", "#0891b2", "#0f766e", "#d97706"],
            orb: ["#0d9488", "#6366f1", "#0891b2"],
        };
    }

    return {
        primary: "#14b8a6",
        primaryDark: "#0f766e",
        accent: "#22d3ee",
        accentSoft: "#22d3ee",
        muted: "#64748b",
        warm: "#f59e0b",
        purple: "#6366f1",
        fog: "#0b1220",
        core: "#14b8a6",
        coreEmissive: "#22d3ee",
        sparkle: "#14b8a6",
        sparkleFine: "#e2e8f0",
        star: "#64748b",
        gridCell: "#0f766e",
        gridSection: "#115e59",
        wire: { outer: 0.28, inner: 0.14, ring: 0.2, shell: 0.06, shellEmissive: 0.12 },
        particle: 0.78,
        nebula: 0.038,
        hex: 0.11,
        orbit: [0.42, 0.24, 0.13],
        arcMuted: "#64748b",
        ribbon: ["#14b8a6", "#6366f1", "#22d3ee", "#0f766e", "#f59e0b"],
        orb: ["#14b8a6", "#6366f1", "#22d3ee"],
    };
}

/** Read theme from DOM (matches next-themes `class` strategy). */
export function readIsLightTheme(): boolean {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("light");
}
