export type GalleryCategory = "Work" | "Learning" | "Life";

export interface GalleryItem {
    id: string;
    title: string;
    category: GalleryCategory;
    description: string;
    gradient: string;
    /**
     * Optional real photo (e.g. "/gallery/remote-setup.jpg"). Drop the file in
     * `public/gallery/` and set this field to replace the gradient placeholder
     * tile for that item — no other changes needed, `GalleryGrid` renders the
     * photo automatically when present and falls back to `gradient` otherwise.
     */
    image?: string;
}

export const galleryItems: GalleryItem[] = [
    {
        id: "1",
        title: "Remote Dev Setup",
        category: "Work",
        description: "Daily full-stack workflow — Next.js, NestJS, and API integrations from Puri, India.",
        gradient: "linear-gradient(135deg, #0f766e 0%, #1e293b 100%)",
    },
    {
        id: "2",
        title: "Production Shipping",
        category: "Work",
        description: "Building and deploying fintech features for HomeAbroad Inc. and Ziffy.ai.",
        gradient: "linear-gradient(135deg, #a855f7 0%, #0f172a 100%)",
    },
    {
        id: "3",
        title: "Certification Milestones",
        category: "Learning",
        description: "14 credentials across Udemy, freeCodeCamp, and institute programs — continuous upskilling.",
        gradient: "linear-gradient(135deg, #22c55e 0%, #0d5c56 100%)",
    },
    {
        id: "4",
        title: "Portfolio Experiments",
        category: "Learning",
        description: "This site — React Three Fiber scene, visitor analytics, and client-side portfolio chat.",
        gradient: "linear-gradient(135deg, #f59e0b 0%, #1e293b 100%)",
    },
    {
        id: "5",
        title: "Puri, Odisha",
        category: "Life",
        description: "Based on the east coast of India — working remotely with US fintech teams.",
        gradient: "linear-gradient(135deg, #ec4899 0%, #0f766e 100%)",
    },
    {
        id: "6",
        title: "Async Collaboration",
        category: "Work",
        description: "Cross-timezone teamwork with product, ops, and engineering on live platforms.",
        gradient: "linear-gradient(135deg, #14b8a6 0%, #334155 100%)",
    },
    {
        id: "7",
        title: "Community Learning",
        category: "Learning",
        description: "Online courses, OSS exploration, and staying current with React & cloud tooling.",
        gradient: "linear-gradient(135deg, #6366f1 0%, #0f172a 100%)",
    },
    {
        id: "8",
        title: "Balance & Focus",
        category: "Life",
        description: "Recharge time that keeps long-term remote engineering sustainable.",
        gradient: "linear-gradient(135deg, #f97316 0%, #1e293b 100%)",
    },
    {
        id: "9",
        title: "GitHub & OSS",
        category: "Work",
        description: "Open-source contributions and public activity — see the GitHub page for the full graph.",
        gradient: "linear-gradient(135deg, #22d3ee 0%, #0f766e 100%)",
    },
];

export const galleryCategories: GalleryCategory[] = ["Work", "Learning", "Life"];
