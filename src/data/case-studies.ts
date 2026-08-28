export interface CaseStudy {
    slug: string;
    title: string;
    subtitle: string;
    stack: string[];
    problem: string;
    approach: string[];
    results: string[];
    links: { label: string; href: string }[];
    /** Optional social preview image (path under public/). */
    ogImage?: string;
}

export const caseStudies: CaseStudy[] = [
    {
        slug: "ziffy-ai-search",
        title: "Ziffy.ai AI Property Search",
        subtitle: "SSE streaming search on a dual-brand Next.js 15 platform",
        stack: ["Next.js 15", "React 19", "Zustand", "TanStack Query", "Typesense", "Vercel"],
        problem:
            "Investors needed natural-language property search with live streaming results, fast SEO listings, and dual-brand theming — without sacrificing Core Web Vitals on Vercel.",
        approach: [
            "Architected a Next.js 15 / React 19 frontend with dual-brand routing and ISR for programmatic listing pages.",
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
        stack: ["NestJS", "TypeORM", "MySQL", "Redis", "BullMQ", "LangGraph", "Typesense"],
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
        stack: ["PHP 8.3", "MySQL", "Redis", "Cloudflare Zero Trust", "Twilio", "Google Gemini"],
        problem:
            "Loan operations relied on dozens of third-party systems (Zoho CRM, Twilio, SendGrid, Floify, Retell AI) with no unified event layer — agents needed AI tools inside one comms center.",
        approach: [
            "Built 60+ webhook receivers and 40+ cron jobs for nurture, CRM sync, and multi-channel messaging.",
            "Shipped 12+ internal browser apps: ClearPath AI, Match AI, Power Dialer, and MLO comms centers.",
            "Secured agent tooling behind Cloudflare Zero Trust with Redis-backed session and queue patterns.",
            "Standardized payload validation and idempotency keys so duplicate webhook deliveries do not double-write CRM records.",
            "Routed high-volume Twilio/SendGrid events through Redis queues with dead-letter logging for ops replay.",
        ],
        results: [
            "Central integration hub replacing one-off scripts across sales and loan ops.",
            "Agent AI tools connected to Gemini, Zoho, and telephony in production workflows.",
            "Reliable async processing for high-volume inbound webhooks and scheduled jobs.",
            "Ops teams debug failed integrations from structured logs instead of grep across PHP error files.",
            "New lender or CRM integrations ship as isolated webhook modules instead of forked one-offs.",
        ],
        links: [
            { label: "HomeAbroad Inc.", href: "https://homeabroadinc.com" },
            { label: "Back to projects", href: "/#projects" },
        ],
        ogImage: "/og/case-php-3rdpartycomms.svg",
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
        links: [{ label: "Back to projects", href: "/#projects" }],
    },
    {
        slug: "property-data-pipelines",
        title: "data-pipelines — Property Ingestion",
        subtitle: "Multi-source scrapers with chunked ingest to MySQL and Typesense",
        stack: ["Python", "Node.js", "MySQL", "Typesense", "AWS S3", "Zillow", "HouseCanary"],
        problem:
            "Property search quality depended on fresh listings, rental inventory, and demographics from Zillow, Roofstock, Homes.com, HouseCanary, HUD, and city-level data — manual imports could not keep pace.",
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
        links: [{ label: "Back to projects", href: "/#projects" }],
    },
    {
        slug: "estimate-calculator",
        title: "estimate-calculator — Loan Math Library",
        subtitle: "Zero-dependency TypeScript engine for mortgage scenarios",
        stack: ["TypeScript", "Jest", "Excel rate sheets", "DSCR", "Liquidity"],
        problem:
            "Loan estimates, DSCR checks, and pricing scenarios were duplicated across NestJS APIs, React calculators, and Lambda scrapers — each with slightly different fee and points logic.",
        approach: [
            "Extracted a shared TypeScript library with typed inputs for fees, liquidity, DSCR, and points/pricing tables.",
            "Mapped Excel rate-sheet columns to pure functions with Jest coverage for regression safety.",
            "Consumed the package from appi, mortgage-pricer, and frontend calculators for one source of truth.",
            "Versioned pricing tables separately from code so lender rule changes do not require API redeploys.",
            "Documented scenario fixtures (purchase vs refi, DSCR thresholds, liquidity reserves) as named Jest cases.",
        ],
        results: [
            "Consistent loan math across API, UI, and serverless pricing pipelines.",
            "Faster iteration on new lender rules without copy-pasting formulas.",
            "Test-backed scenarios for edge cases in fees and liquidity thresholds.",
            "Loan officers see the same numbers in NestJS estimates, React calculators, and Lambda scraper output.",
            "Regression tests catch Excel column drift before it reaches production pricing.",
        ],
        links: [
            { label: "All case studies", href: "/work/" },
            { label: "Back to projects", href: "/#projects" },
        ],
        ogImage: "/og/case-estimate-calculator.svg",
    },
    {
        slug: "ha-realtor-plat",
        title: "ha-realtor-plat — Agent / MLO Platform",
        subtitle: "Multi-app React frontend for agents, MLOs, and investors",
        stack: ["React", "Webpack", "Tailwind CSS", "Leaflet", "Zustand", "Formik"],
        problem:
            "HomeAbroad needed one production frontend for real-estate agents, mortgage loan officers, processors, and clients — maps, loan workflows, referrals, and documents — without forking a separate codebase per role.",
        approach: [
            "Built a Webpack multi-app shell with role-based routing for RE, MLO, processor, partner, and client users.",
            "Shipped Leaflet property maps, loan application dashboards, DSCR/cash-to-close calculators, and document portals.",
            "Connected Zoho CRM referrals, agent-client messaging, and analytics (GA4, LogRocket, Fingerprint.js).",
            "Kept a dedicated Ziffy webpack entry so the consumer investor UI could ship independently from the agent platform.",
        ],
        results: [
            "Single React codebase serving agent, MLO, and client workflows in production.",
            "Interactive maps and investment analytics on property discovery instead of static listing tables.",
            "Loan processing, document upload, and referral tracking in one RBAC-gated app.",
        ],
        links: [
            { label: "HomeAbroad Inc.", href: "https://homeabroadinc.com" },
            { label: "Back to projects", href: "/#projects" },
        ],
    },
    {
        slug: "rental-estimate-avm",
        title: "Rental-Estimate-AVM — CatBoost Rent Model",
        subtitle: "Rent estimates from real asking prices, comps, and SHAP explanations",
        stack: ["Python", "FastAPI", "CatBoost", "DuckDB", "pandas", "AWS S3"],
        problem:
            "DSCR and yield underwriting used Zillow rent Zestimates scaled by a constant — those numbers drifted from real for-rent asking prices and could not be explained to loan officers.",
        approach: [
            "Trained CatBoost on observed for-rent asking prices with ZIP market context, comps, and HUD FMR guards — not Zestimate multipliers.",
            "Split training (cron, checkpointed curate → train → promote) from serving (FastAPI reads champion.json only; IAM has no write access).",
            "Exposed POST /v1/rent/estimate and an explain route with SHAP factor dollars, comps, and underwritable rent for DSCR.",
            "Used S3 for training/serving datasets in production and a local file backend so the same pipeline runs on a laptop.",
        ],
        results: [
            "Hybrid rent estimates with low/high bands, confidence, and model version instead of a single opaque Zestimate.",
            "Loan officers can see which features moved rent (comps PSF, sqft, ZIP median ask, age) in dollars.",
            "State rollout is configuration (AVM_STATES), not a new scraper or API rewrite.",
        ],
        links: [
            { label: "All case studies", href: "/work/" },
            { label: "Back to projects", href: "/#projects" },
        ],
    },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
    return caseStudies.find((c) => c.slug === slug);
}
