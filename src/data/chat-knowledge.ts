export interface KnowledgeEntry {
    keywords: string[];
    answer: string;
}

export const suggestedPromptPool = [
    "What is Rihan's tech stack?",
    "Tell me about Ziffy.ai",
    "What certifications does Rihan have?",
    "How can I contact Rihan?",
    "Summarize his experience",
    "What did Rihan build at HomeAbroad?",
    "List his top projects",
    "Is Rihan open to new roles?",
    "Where is Rihan based?",
    "What's his education background?",
    "Tell me about his NestJS work",
    "What AWS and DevOps experience does he have?",
    "How many years of experience?",
    "What frontend frameworks does he use?",
    "Does he work with Python or PHP?",
    "What fintech experience does Rihan have?",
    "Can I download his resume?",
    "What AI or LangChain work has he done?",
];

/** @deprecated use suggestedPromptPool */
export const suggestedPrompts = suggestedPromptPool.slice(0, 5);

const PROMPT_DISPLAY_COUNT = 4;

function shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

/** Pick random prompts, avoiding recently used ones when possible. */
export function pickSuggestedPrompts(
    exclude: Iterable<string> = [],
    count = PROMPT_DISPLAY_COUNT
): string[] {
    const excluded = new Set(exclude);
    let available = suggestedPromptPool.filter((p) => !excluded.has(p));

    if (available.length < count) {
        available = [...suggestedPromptPool];
    }

    return shuffle(available).slice(0, count);
}

export const knowledgeBase: KnowledgeEntry[] = [
    {
        keywords: ["hello", "hi", "hey", "who are you"],
        answer: "Hi! I'm **Rihan's portfolio assistant**. I can answer questions about his skills, experience, projects, certifications, and contact info.\n\nAsk anything from the suggested prompts, or type your own question.",
    },
    {
        keywords: ["stack", "tech", "skills", "technologies", "framework"],
        answer: "Rihan's core stack:\n\n- **Frontend:** React, Next.js, TypeScript, CSS Modules, Framer Motion, React Three Fiber\n- **Backend:** NestJS, Node.js, PHP 8, REST APIs, BullMQ, SSE streaming\n- **Data:** MySQL, Redis, Supabase, Typesense, Python data pipelines\n- **AI / cloud:** LangChain, AWS Lambda, Docker, GitHub Actions, Vercel\n\nHe specializes in **fintech and real-estate platforms** at production scale.",
    },
    {
        keywords: ["ziffy", "ziffy.ai"],
        answer: "**Full Stack Engineer @ Ziffy.ai** (Jan 2025 – Present)\n\n- Next.js 16 / React 19 frontend with dual-brand support\n- AI property search with **SSE streaming**\n- SEO programmatic listings & DSCR calculators\n- Multi-channel analytics integration",
    },
    {
        keywords: ["homeabroad", "home abroad"],
        answer: "**Full Stack Developer @ HomeAbroad Inc.** (Apr 2022 – Present)\n\n- Core **NestJS API** and React multi-app frontend\n- PHP webhook backend (**60+ webhooks**)\n- AWS Lambda mortgage pricer & data pipelines\n- Led **AWS → Hetzner** infrastructure migration",
    },
    {
        keywords: ["experience", "years", "career", "work", "summarize", "summary"],
        answer: "Rihan has **4+ years** of full-stack experience across US-based fintech and real-estate companies:\n\n- **Ziffy.ai** — AI-powered property platform (current)\n- **HomeAbroad Inc.** — mortgage & cross-border real estate\n\nHe ships production APIs, frontends, and data systems end-to-end.",
    },
    {
        keywords: ["project", "portfolio", "built"],
        answer: "Key projects:\n\n- **Ziffy.ai** — [Case study](/work/ziffy-ai-search/)\n- **appi Core API** — [Case study](/work/nestjs-appi-api/)\n- **3rdpartycomms** — [Case study](/work/php-3rdpartycomms/)\n- **mortgage-pricer** — [Case study](/work/lambda-mortgage-pricer/)\n- **data-pipelines** — [Case study](/work/property-data-pipelines/)\n- **estimate-calculator** — shared TypeScript loan math library",
    },
    {
        keywords: ["certification", "cert", "udemy", "freecodecamp", "course"],
        answer: "Rihan holds **14 certifications**:\n\n- **11 from Udemy** — Web Dev, React, Node.js, Python, databases, and more\n- **2 from freeCodeCamp** — JS Algorithms & Responsive Web Design\n- **PGDCA** — Utkal University (HDVSc Degree College, Panaspada, Puri)",
    },
    {
        keywords: ["education", "degree", "pgdca", "diploma", "college"],
        answer: "**Education**\n\n- PGDCA — Utkal University (HDVSc Degree College, Panaspada, Puri) · 2020–2021\n- Honors / Regents High School Diploma (2016–2019)",
    },
    {
        keywords: ["contact", "email", "phone", "reach", "hire", "linkedin"],
        answer: "**Get in touch with Rihan**\n\n- Email: [im.rihan.dev@gmail.com](mailto:im.rihan.dev@gmail.com)\n- Phone: +91 76820 78927\n- LinkedIn: [linkedin.com/in/im-rihan](https://linkedin.com/in/im-rihan)\n- GitHub: [github.com/im-rihan](https://github.com/im-rihan)\n\nBased in **Puri, Odisha, India** · open to remote roles.",
    },
    {
        keywords: ["location", "where", "live", "based", "puri", "odisha"],
        answer: "Rihan is based in **Puri, Odisha, India** and works remotely for US-based companies.",
    },
    {
        keywords: ["resume", "cv", "download"],
        answer: "View Rihan's resume from the **Contact** section — **HTML**, **PDF**, and **Word** downloads. Regenerate from `resume/` in the portfolio repo (`npm run generate:resume`).",
    },
    {
        keywords: ["nestjs", "next.js", "react", "python", "php"],
        answer: "Rihan uses **NestJS** and **PHP** for backend APIs, **React/Next.js** for frontends, **Python** for data pipelines and scrapers, and **TypeScript** across the stack.",
    },
    {
        keywords: ["available", "open", "opportunity", "job"],
        answer: "Rihan is **available for opportunities** — open to networking, collaboration, and full-stack roles. Reach out via email or LinkedIn.",
    },
];

export const offTopicMessage =
    "I can only answer questions about **Rihan Mohammed's portfolio** — skills, experience, projects, and certifications.\n\nTry asking about his stack, work at Ziffy.ai, or how to contact him.";
