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
    {
        slug: "php-3rdpartycomms",
        title: "3rdpartycomms — Integration Hub",
        subtitle: "PHP webhook orchestration and internal AI agent tooling",
        stack: ["PHP 8", "MySQL", "Redis", "Cloudflare Zero Trust", "Twilio", "Google Gemini"],
        problem:
            "Loan operations relied on dozens of third-party systems (Zoho CRM, Twilio, SendGrid, Floify, Retell AI) with no unified event layer — agents needed AI tools inside one comms center.",
        approach: [
            "Built 60+ webhook receivers and 40+ cron jobs for nurture, CRM sync, and multi-channel messaging.",
            "Shipped 12+ internal browser apps: ClearPath AI, Match AI, Power Dialer, and MLO comms centers.",
            "Secured agent tooling behind Cloudflare Zero Trust with Redis-backed session and queue patterns.",
        ],
        results: [
            "Central integration hub replacing one-off scripts across sales and loan ops.",
            "Agent AI tools connected to Gemini, Zoho, and telephony in production workflows.",
            "Reliable async processing for high-volume inbound webhooks and scheduled jobs.",
        ],
        links: [
            { label: "HomeAbroad Inc.", href: "https://homeabroadinc.com" },
            { label: "Back to projects", href: "/#projects" },
        ],
    },
    {
        slug: "lambda-mortgage-pricer",
        title: "mortgage-pricer — Lambda Scrapers",
        subtitle: "Headless browser service for live Non-QM / DSCR lender rates",
        stack: ["TypeScript", "Puppeteer", "AWS Lambda", "API Gateway", "S3", "Serverless"],
        problem:
            "Loan officers needed live pricing from 11 Non-QM and DSCR lender portals — each with different login flows, DOM structures, and rate tables updated daily.",
        approach: [
            "Designed a pluggable scraper registry with one module per lender portal.",
            "Ran Puppeteer on AWS Lambda with @sparticuz/chromium and S3 audit screenshots.",
            "Exposed a typed REST API (OpenAPI) consumed by the NestJS estimate pipeline.",
        ],
        results: [
            "Automated rate pulls from 11 lender portals without manual portal hopping.",
            "Screenshot audit trail stored in S3 for compliance and debugging.",
            "Serverless scaling for batch pricing jobs without dedicated browser servers.",
        ],
        links: [
            { label: "Back to projects", href: "/#projects" },
        ],
    },
    {
        slug: "property-data-pipelines",
        title: "data-pipelines — Property Ingestion",
        subtitle: "Multi-source scrapers with chunked ingest to MySQL and Typesense",
        stack: ["Python", "Node.js", "MySQL", "Typesense", "AWS S3", "ScrapingBee"],
        problem:
            "Property search quality depended on fresh listings and demographics from Zillow, Roofstock, Homes.com, and city-level data — manual imports could not keep pace.",
        approach: [
            "Built Python scrapers per source with resumable batching and proxy APIs where needed.",
            "Added Node.js ingestion scripts with chunked writes to MySQL and Typesense sync.",
            "Used SSH tunnel staging workflows and S3 for intermediate extracts and recovery.",
        ],
        results: [
            "End-to-end acquisition from scrape → normalize → index for investor search.",
            "Resumable imports that survive partial failures on large state-level runs.",
            "Search index kept aligned with relational property data in production.",
        ],
        links: [
            { label: "Back to projects", href: "/#projects" },
        ],
    },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
    return caseStudies.find((c) => c.slug === slug);
}
