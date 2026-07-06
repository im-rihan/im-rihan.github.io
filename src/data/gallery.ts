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

// `image` below points at real, freely-licensed photos on Unsplash's CDN
// (https://unsplash.com/license — free to use, attribution appreciated but
// not required) chosen to match each tile's theme, standing in until actual
// photos are uploaded. Unsplash's old random-by-keyword "Source" API was
// shut down in 2024, so these are specific, verified photo IDs rather than
// a random feed. Swap `image` for a real file in `public/gallery/` (see the
// README there) whenever a photo becomes available — the gradient stays as
// the fallback if `image` is ever removed.
export const galleryItems: GalleryItem[] = [
    {
        id: "1",
        title: "Remote Dev Setup",
        category: "Work",
        description: "Daily full-stack workflow — Next.js, NestJS, and API integrations from Puri, India.",
        gradient: "linear-gradient(135deg, #0f766e 0%, #1e293b 100%)",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&h=500&q=80",
    },
    {
        id: "2",
        title: "Production Shipping",
        category: "Work",
        description: "Building and deploying fintech features for HomeAbroad Inc. and Ziffy.ai.",
        gradient: "linear-gradient(135deg, #a855f7 0%, #0f172a 100%)",
        image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&h=500&q=80",
    },
    {
        id: "3",
        title: "Certification Milestones",
        category: "Learning",
        description: "14 credentials across Udemy, freeCodeCamp, and institute programs — continuous upskilling.",
        gradient: "linear-gradient(135deg, #22c55e 0%, #0d5c56 100%)",
        image: "https://images.unsplash.com/photo-1638636241638-aef5120c5153?auto=format&fit=crop&w=800&h=500&q=80",
    },
    {
        id: "4",
        title: "Portfolio Experiments",
        category: "Learning",
        description: "This site — React Three Fiber scene, visitor analytics, and client-side portfolio chat.",
        gradient: "linear-gradient(135deg, #f59e0b 0%, #1e293b 100%)",
        image: "https://images.unsplash.com/photo-1743090661056-e51700546169?auto=format&fit=crop&w=800&h=500&q=80",
    },
    {
        id: "5",
        title: "Puri, Odisha",
        category: "Life",
        description: "Based on the east coast of India — working remotely with US fintech teams.",
        gradient: "linear-gradient(135deg, #ec4899 0%, #0f766e 100%)",
        image: "https://images.unsplash.com/photo-1588785132849-6ce948de2a48?auto=format&fit=crop&w=800&h=500&q=80",
    },
    {
        id: "6",
        title: "Async Collaboration",
        category: "Work",
        description: "Cross-timezone teamwork with product, ops, and engineering on live platforms.",
        gradient: "linear-gradient(135deg, #14b8a6 0%, #334155 100%)",
        image: "https://images.unsplash.com/photo-1616531770192-6eaea74c2456?auto=format&fit=crop&w=800&h=500&q=80",
    },
    {
        id: "7",
        title: "Community Learning",
        category: "Learning",
        description: "Online courses, OSS exploration, and staying current with React & cloud tooling.",
        gradient: "linear-gradient(135deg, #6366f1 0%, #0f172a 100%)",
        image: "https://images.unsplash.com/photo-1627903629659-ca4a31e17a34?auto=format&fit=crop&w=800&h=500&q=80",
    },
    {
        id: "8",
        title: "Balance & Focus",
        category: "Life",
        description: "Recharge time that keeps long-term remote engineering sustainable.",
        gradient: "linear-gradient(135deg, #f97316 0%, #1e293b 100%)",
        image: "https://images.unsplash.com/photo-1659087374131-6707281eba1a?auto=format&fit=crop&w=800&h=500&q=80",
    },
    {
        id: "9",
        title: "GitHub & OSS",
        category: "Work",
        description: "Open-source contributions and public activity — see the GitHub page for the full graph.",
        gradient: "linear-gradient(135deg, #22d3ee 0%, #0f766e 100%)",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&h=500&q=80",
    },
];

export const galleryCategories: GalleryCategory[] = ["Work", "Learning", "Life"];
