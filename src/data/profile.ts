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
    "Skilled across React, Next.js, TypeScript, NestJS, Node.js, and Python — from AI-native property search and SSE streaming to PHP webhook backends, data pipelines, and AWS deployments.",
    "Committed to delivering innovative, user-focused solutions through effective collaboration and continuous learning.",
];

export const skillGroups = [
    {
        title: "Frontend",
        tags: [
            "React 19",
            "Next.js 16",
            "TypeScript",
            "JavaScript",
            "CSS Modules",
            "Framer Motion",
            "React Three Fiber",
            "Zustand",
            "TanStack Query",
            "Tailwind CSS",
        ],
    },
    {
        title: "Backend",
        tags: [
            "NestJS",
            "Node.js",
            "PHP 8",
            "REST APIs",
            "TypeORM",
            "BullMQ",
            "SSE Streaming",
            "Puppeteer",
        ],
    },
    {
        title: "Data & Search",
        tags: [
            "MySQL",
            "Redis",
            "Supabase",
            "Typesense",
            "Python",
            "Data Pipelines",
            "Data Ingestion",
        ],
    },
    {
        title: "AI & Integrations",
        tags: [
            "LangChain",
            "OpenAI",
            "Google Gemini",
            "Zoho CRM",
            "Twilio",
            "SendGrid",
        ],
    },
    {
        title: "DevOps & Cloud",
        tags: [
            "GitHub Actions",
            "GitHub Pages",
            "AWS Lambda",
            "Amazon EC2",
            "Docker",
            "Vercel",
            "Cloudflare",
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
            "Architected Next.js 16 / React 19 frontend with dual-brand support, deployed on Vercel with ISR and BunnyCDN sitemaps.",
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
            "Built core NestJS REST API — auth, property search, loan estimates, CRM sync, LangChain AI with TypeORM/MySQL and BullMQ.",
            "Developed React multi-app frontend with Webpack/Tailwind — agent dashboard, property maps, loan calculators.",
            "Owned PHP integration backend — 60+ webhooks, 40+ cron jobs, 12+ internal AI agent tools.",
            "Shipped AWS Lambda mortgage pricer with Puppeteer scrapers for 11 lender portals.",
            "Built Python/Node.js data pipelines and led AWS → Hetzner zero-downtime migration.",
        ],
    },
];

export interface Project {
    icon: string;
    title: string;
    stack: string;
    description: string;
    url?: string;
    caseStudySlug?: string;
}

export const projects: Project[] = [
    {
        icon: "🏠",
        title: "Ziffy.ai Platform",
        stack: "Next.js 16 · React 19 · Zustand · SSE · Vercel",
        description:
            "AI-native investor platform with streaming NLP search, SEO listings, DSCR calculators, and dual-brand deployment.",
        url: "https://ziffy.ai",
        caseStudySlug: "ziffy-ai-search",
    },
    {
        icon: "⚡",
        title: "appi — Core API",
        stack: "NestJS · TypeORM · Redis · Typesense · LangChain",
        description:
            "Modular REST API powering property search, loan estimates, auth, CRM sync, and AI-assisted SEO content.",
        url: "https://homeabroadinc.com",
        caseStudySlug: "nestjs-appi-api",
    },
    {
        icon: "🔗",
        title: "3rdpartycomms",
        stack: "PHP 8 · MySQL · Redis · Cloudflare Zero Trust",
        description:
            "Webhook-driven integration hub with agent AI tools, nurture campaigns, and multi-channel comms orchestration.",
        caseStudySlug: "php-3rdpartycomms",
    },
    {
        icon: "💰",
        title: "mortgage-pricer",
        stack: "TypeScript · Puppeteer · AWS Lambda · Serverless",
        description:
            "Headless browser microservice scraping live rates from 11 lender portals with pluggable scraper registry.",
        caseStudySlug: "lambda-mortgage-pricer",
    },
    {
        icon: "📊",
        title: "estimate-calculator",
        stack: "TypeScript · Jest · Zero-dep library",
        description:
            "Reusable mortgage calculation engine — fees, liquidity, DSCR, points/pricing scenarios, Excel rate sheets.",
    },
    {
        icon: "🔄",
        title: "data-pipelines",
        stack: "Python · Node.js · Typesense · AWS S3",
        description:
            "End-to-end property data acquisition — multi-source scrapers with chunked/resumable ingestion to MySQL.",
        caseStudySlug: "property-data-pipelines",
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

export const portfolioStats = {
    certifications: 14,
    yearsExperience: "4+",
    projects: 9,
    companies: 2,
    skillCategories: skillGroups.length,
};
