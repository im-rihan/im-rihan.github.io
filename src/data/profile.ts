import { certifications } from "@/data/certifications";

export const siteMeta = {
    name: "Rihan Mohammed",
    title: "Full Stack Developer",
    tagline: "Full Stack Developer · HomeAbroad Inc. | Ziffy.ai",
    description:
        "I build production fintech & real-estate platforms — from AI-powered property search and NestJS APIs to data pipelines and cloud infrastructure.",
    email: "im.rihan.dev@gmail.com",
    phone: "+91 76820 78927",
    location: "Puri, Odisha, India",
    github: "https://github.com/im-rihan",
    linkedin: "https://linkedin.com/in/im-rihan",
    twitter: "https://twitter.com/_im_rihan_",
    available: true,
};

export const stats = [
    { num: "4+", label: "Years Experience" },
    { num: "9+", label: "Production Projects" },
    { num: "2", label: "Companies" },
    { num: "60+", label: "Webhooks Built" },
];

export const aboutParagraphs = [
    "Passionate Full Stack Developer with nearly 4 years at HomeAbroad Inc. and Ziffy.ai, building production fintech and real-estate platforms at scale.",
    "Skilled across React, Next.js, TypeScript, NestJS, Node.js, PHP, and Python — from AI-native property search and SSE streaming to webhook backends, data pipelines, CatBoost rent models, and AWS deployments.",
    "Committed to delivering innovative, user-focused solutions through effective collaboration and continuous learning.",
];

export const skillGroups = [
    {
        title: "Frontend",
        tags: [
            "React 19",
            "Next.js 15",
            "TypeScript",
            "JavaScript",
            "Tailwind CSS",
            "Webpack",
            "Zustand",
            "TanStack Query",
            "Formik",
            "PrimeReact",
            "Leaflet",
        ],
    },
    {
        title: "Backend",
        tags: [
            "NestJS",
            "Node.js",
            "PHP 8.3",
            "FastAPI",
            "Express",
            "TypeORM",
            "BullMQ",
            "REST APIs",
            "SSE Streaming",
            "Puppeteer",
        ],
    },
    {
        title: "Data & Search",
        tags: [
            "MySQL",
            "Redis",
            "Typesense",
            "Python",
            "CatBoost",
            "pandas",
            "DuckDB",
            "Data Ingestion",
        ],
    },
    {
        title: "AI & Integrations",
        tags: [
            "LangChain",
            "LangGraph",
            "OpenAI",
            "Google Gemini",
            "MCP",
            "Zoho CRM",
            "Twilio",
            "SendGrid",
        ],
    },
    {
        title: "DevOps & Cloud",
        tags: [
            "GitHub Actions",
            "AWS Lambda",
            "AWS S3",
            "Serverless",
            "Docker",
            "Vercel",
            "Hetzner",
            "Cloudflare",
            "Nginx",
            "CI/CD",
        ],
    },
];

export const experience = [
    {
        role: "Full Stack Engineer",
        company: "Ziffy.ai · Full-time",
        period: "Jan 2025 – Present · Remote",
        subtitle: "AI-native real estate investment platform — ziffy.ai",
        bullets: [
            "Architected Next.js 15 / React 19 frontend with dual-brand support, deployed on Vercel with ISR, TanStack Query, and BunnyCDN sitemaps.",
            "Built AI property search with SSE streaming, Zustand state sync, and Typesense full-text search.",
            "Delivered SEO programmatic listings, DSCR calculators, and mortgage pre-approval portal with document uploads.",
            "Integrated GA4, Google Ads, Facebook Pixel, LogRocket, and Fingerprint.js fraud detection.",
        ],
    },
    {
        role: "Full Stack Developer",
        company: "HomeAbroad Inc. · Full-time",
        period: "Apr 2022 – Present · Remote",
        subtitle: "Fintech/real-estate platform — full-stack application development",
        bullets: [
            "Built core NestJS REST API — auth, property search, loan estimates, CRM sync, LangChain/LangGraph AI with TypeORM/MySQL and BullMQ.",
            "Developed React multi-app frontend (ha-realtor-plat) with Webpack/Tailwind — agent dashboard, Leaflet maps, loan calculators.",
            "Owned PHP 8.3 integration backend — 60+ webhooks, 40+ cron jobs, 12+ internal AI agent tools.",
            "Shipped AWS Lambda mortgage pricer with Puppeteer scrapers for 11 lender portals.",
            "Built Python/Node.js data pipelines, a CatBoost rental AVM (FastAPI), and led AWS → Hetzner zero-downtime migration.",
        ],
    },
];

export type ProjectCategory = "frontend" | "backend" | "integrations" | "data" | "library";

export interface Project {
    icon: string;
    title: string;
    stack: string;
    description: string;
    category: ProjectCategory;
    url?: string;
    caseStudySlug?: string;
}

export const projectCategories: { id: ProjectCategory | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "integrations", label: "Integrations" },
    { id: "data", label: "Data" },
    { id: "library", label: "Libraries" },
];

export const projects: Project[] = [
    {
        icon: "🏠",
        title: "Ziffy.ai Platform",
        stack: "Next.js 15 · React 19 · Zustand · TanStack Query · Vercel",
        description:
            "AI-native investor platform with streaming NLP search, SEO listings, DSCR calculators, and dual-brand deployment.",
        url: "https://ziffy.ai",
        category: "frontend",
        caseStudySlug: "ziffy-ai-search",
    },
    {
        icon: "🗺️",
        title: "ha-realtor-plat",
        stack: "React · Webpack · Tailwind · Leaflet · Zustand",
        description:
            "Multi-app agent/MLO platform — dashboards, property maps, loan workflows, and role-based routing for RE agents, MLOs, and clients.",
        url: "https://homeabroadinc.com",
        category: "frontend",
        caseStudySlug: "ha-realtor-plat",
    },
    {
        icon: "⚡",
        title: "appi — Core API",
        stack: "NestJS · TypeORM · Redis · Typesense · LangGraph",
        description:
            "Modular REST API powering property search, loan estimates, auth, CRM sync, LangChain/LangGraph AI, and MCP tooling.",
        url: "https://homeabroadinc.com",
        category: "backend",
        caseStudySlug: "nestjs-appi-api",
    },
    {
        icon: "🔗",
        title: "3rdpartycomms",
        stack: "PHP 8.3 · MySQL · Redis · Cloudflare Zero Trust",
        description:
            "Webhook-driven integration hub with agent AI tools (ClearPath, Match AI, dialer), nurture campaigns, and Twilio/Zoho/SendGrid orchestration.",
        category: "integrations",
        caseStudySlug: "php-3rdpartycomms",
    },
    {
        icon: "💰",
        title: "mortgage-pricer",
        stack: "TypeScript · Puppeteer · Express · AWS Lambda",
        description:
            "Headless Chromium microservice scraping live rates from 11 lender portals with a pluggable scraper registry and S3 audit screenshots.",
        category: "backend",
        caseStudySlug: "lambda-mortgage-pricer",
    },
    {
        icon: "📊",
        title: "estimate-calculator",
        stack: "TypeScript · Jest · Zero-dep library",
        description:
            "Reusable mortgage calculation engine — fees, liquidity, DSCR, points/pricing scenarios, Excel rate sheets.",
        category: "library",
        caseStudySlug: "estimate-calculator",
    },
    {
        icon: "🔄",
        title: "data-pipelines",
        stack: "Python · Node.js · Typesense · MySQL",
        description:
            "Property acquisition from Zillow, Homes.com, HouseCanary, Roofstock, HUD, and demographics — scrape to MySQL/Typesense ingest.",
        category: "data",
        caseStudySlug: "property-data-pipelines",
    },
    {
        icon: "🏡",
        title: "Rental-Estimate-AVM",
        stack: "Python · FastAPI · CatBoost · DuckDB · S3",
        description:
            "Rent estimates from real asking prices and comps — CatBoost training pipeline with SHAP explanations served over FastAPI.",
        category: "data",
        caseStudySlug: "rental-estimate-avm",
    },
];

export const education = [
    {
        degree: "Post Graduate Diploma in Computer Application (PGDCA)",
        school: "Utkal University",
        campus: "HDVSc Degree College, Panaspada, Puri",
        year: "2020 – 2021",
    },
    {
        degree: "Honors / Regents High School Diploma",
        school: "HDVSc Degree College, Panaspada, Puri",
        campus: "",
        year: "2016 – 2019",
    },
];

/** Computed from live data files — no manual sync needed. */
export const portfolioStats = {
    certifications: certifications.length,
    yearsExperience: "4+",
    projects: projects.length,
    companies: 2,
    skillCategories: skillGroups.length,
};
