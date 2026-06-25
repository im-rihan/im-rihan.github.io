export interface KnowledgeEntry {
    keywords: string[];
    answer: string;
}

export const suggestedPrompts = [
    "What is Rihan's tech stack?",
    "Tell me about Ziffy.ai",
    "What certifications does Rihan have?",
    "How can I contact Rihan?",
    "What is Rihan's experience at HomeAbroad?",
];

export const knowledgeBase: KnowledgeEntry[] = [
    {
        keywords: ["hello", "hi", "hey", "who are you"],
        answer: "Hi! I'm Rihan's portfolio assistant. I can answer questions about Rihan Mohammed — his skills, experience, projects, certifications, and contact info.",
    },
    {
        keywords: ["stack", "tech", "skills", "technologies", "framework"],
        answer: "Rihan's stack includes React, Next.js 15, TypeScript, NestJS, Node.js, PHP 8, Python, MySQL, Redis, Typesense, LangChain, AWS, Docker, and CI/CD with GitHub Actions. He specializes in fintech and real-estate platforms.",
    },
    {
        keywords: ["ziffy", "ziffy.ai"],
        answer: "Rihan is a Full Stack Engineer at Ziffy.ai (Jan 2025 – Present). He architected the Next.js 15 / React 19 frontend with dual-brand support, AI property search with SSE streaming, SEO programmatic listings, DSCR calculators, and multi-channel analytics.",
    },
    {
        keywords: ["homeabroad", "home abroad"],
        answer: "Rihan has been a Full Stack Developer at HomeAbroad Inc. since Apr 2022. He built the core NestJS API, React multi-app frontend, PHP webhook backend (60+ webhooks), AWS Lambda mortgage pricer, data pipelines, and led AWS → Hetzner migration.",
    },
    {
        keywords: ["experience", "years", "career", "work"],
        answer: "Rihan has 4+ years of full-stack experience across HomeAbroad Inc. and Ziffy.ai, building production fintech and real-estate platforms at scale.",
    },
    {
        keywords: ["project", "portfolio", "built"],
        answer: "Key projects include Ziffy.ai Platform, appi Core API (NestJS), 3rdpartycomms (PHP webhooks), mortgage-pricer (Puppeteer/Lambda), estimate-calculator, and data-pipelines for property ingestion.",
    },
    {
        keywords: ["certification", "cert", "udemy", "freecodecamp", "course"],
        answer: "Rihan holds 14 certifications — 11 from Udemy (Web Development, React, Node.js, Python, databases, and more), 2 from freeCodeCamp (JS Algorithms & Responsive Web Design), and a PGDCA from Survey Institute Gulf Training.",
    },
    {
        keywords: ["education", "degree", "pgdca", "diploma", "college"],
        answer: "Rihan completed PGDCA from Utkal University (HDVSc Degree College, Panaspada, Puri) and Honors / Regents High School Diploma (2016–2019).",
    },
    {
        keywords: ["contact", "email", "phone", "reach", "hire", "linkedin"],
        answer: "Contact Rihan at im.rihan.dev@gmail.com or +91 76820 78927. LinkedIn: linkedin.com/in/im-rihan · GitHub: github.com/im-rihan. Based in Puri, Odisha, India.",
    },
    {
        keywords: ["location", "where", "live", "based", "puri", "odisha"],
        answer: "Rihan is based in Puri, Odisha, India and works remotely for US-based companies.",
    },
    {
        keywords: ["resume", "cv", "download"],
        answer: "You can download Rihan's resume as PDF or Word from the Contact section on the home page, or visit the portfolio contact area.",
    },
    {
        keywords: ["nestjs", "next.js", "react", "python", "php"],
        answer: "Rihan uses NestJS and PHP for backend APIs, React/Next.js for frontends, Python for data pipelines and scrapers, and TypeScript across the stack.",
    },
    {
        keywords: ["available", "open", "opportunity", "job"],
        answer: "Rihan is available for opportunities — open to networking, collaboration, and new roles in full-stack development.",
    },
];

export const offTopicMessage =
    "I can only answer questions about Rihan Mohammed's portfolio, skills, experience, projects, and certifications. Try asking about his stack, work at Ziffy.ai, or how to contact him.";
