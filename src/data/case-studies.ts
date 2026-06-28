export interface CaseStudy {
    slug: string;
    title: string;
    subtitle: string;
    stack: string[];
    problem: string;
    approach: string[];
    results: string[];
    links: { label: string; href: string }[];
}

export const caseStudies: CaseStudy[] = [
    {
        slug: "ziffy-ai-search",
        title: "Ziffy.ai AI Property Search",
        subtitle: "SSE streaming search on a dual-brand Next.js 16 platform",
        stack: ["Next.js 16", "React 19", "Zustand", "SSE", "Typesense", "Vercel"],
        problem:
            "Investors needed natural-language property search with live streaming results, fast SEO listings, and dual-brand theming — without sacrificing Core Web Vitals on Vercel.",
        approach: [
            "Architected a Next.js 16 / React 19 frontend with dual-brand routing and ISR for programmatic listing pages.",
            "Built AI property search with SSE streaming, Zustand state sync, and Typesense full-text indexing.",
            "Delivered DSCR calculators, mortgage pre-approval flows, and multi-channel analytics (GA4, Ads, Pixel).",
        ],
        results: [
            "Streaming search UX with token-by-token updates instead of blocking full-page reloads.",
            "Dual-brand deployment on Vercel with CDN-backed sitemaps and SEO listing coverage.",
            "Integrated fraud detection and session analytics for production traffic.",
        ],
        links: [
            { label: "Visit Ziffy.ai", href: "https://ziffy.ai" },
            { label: "Back to projects", href: "/#projects" },
        ],
    },
    {
        slug: "nestjs-appi-api",
        title: "appi — Core NestJS API",
        subtitle: "Modular REST platform for property, loans, and CRM sync",
        stack: ["NestJS", "TypeORM", "MySQL", "Redis", "BullMQ", "LangChain", "Typesense"],
        problem:
            "HomeAbroad's fintech platform needed a unified API for auth, property search, loan estimates, CRM sync, and AI-assisted content — with reliable background jobs and search.",
        approach: [
            "Built modular NestJS REST services with TypeORM/MySQL and Redis caching.",
            "Integrated BullMQ for async jobs and LangChain for AI-assisted SEO workflows.",
            "Connected Typesense for fast property search and Zoho CRM sync endpoints.",
        ],
        results: [
            "Single API backbone for multiple React frontends and internal tools.",
            "60+ webhook integrations orchestrated via companion PHP services.",
            "Production-grade auth, loan estimates, and property search at scale.",
        ],
        links: [
            { label: "HomeAbroad Inc.", href: "https://homeabroadinc.com" },
            { label: "Back to projects", href: "/#projects" },
        ],
    },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
    return caseStudies.find((c) => c.slug === slug);
}
