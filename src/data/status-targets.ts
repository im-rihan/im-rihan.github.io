import { caseStudies } from "@/data/case-studies";

export type StatusGroup = "page" | "asset" | "case-study" | "seo" | "external";

/** External probes in this set use no-cors and routinely return opaque responses.
 *  They are shown as informational only and excluded from overall health calculation. */
export const INFORMATIONAL_EXTERNAL_URLS = new Set([
    "https://github.com/im-rihan",
    "https://linkedin.com/in/im-rihan",
]);

export interface StatusTarget {
    name: string;
    url: string;
    type: "internal" | "external";
    group: StatusGroup;
}

export const SITE_BASE = "https://im-rihan.github.io";

const corePages: StatusTarget[] = [
    { name: "Portfolio Home", url: `${SITE_BASE}/`, type: "internal", group: "page" },
    { name: "Case Studies Hub", url: `${SITE_BASE}/work/`, type: "internal", group: "page" },
    { name: "Blog", url: `${SITE_BASE}/blog/`, type: "internal", group: "page" },
    { name: "Portfolio Chat", url: `${SITE_BASE}/chat/`, type: "internal", group: "page" },
    { name: "GitHub Activity", url: `${SITE_BASE}/github/`, type: "internal", group: "page" },
    { name: "Gallery", url: `${SITE_BASE}/gallery/`, type: "internal", group: "page" },
    { name: "Analytics", url: `${SITE_BASE}/status/`, type: "internal", group: "page" },
];

const assets: StatusTarget[] = [
    { name: "Resume HTML", url: `${SITE_BASE}/resume.html`, type: "internal", group: "asset" },
    { name: "Resume PDF", url: `${SITE_BASE}/resume.pdf`, type: "internal", group: "asset" },
    { name: "Resume Word", url: `${SITE_BASE}/resume.docx`, type: "internal", group: "asset" },
];

const seo: StatusTarget[] = [
    { name: "Sitemap", url: `${SITE_BASE}/sitemap.xml`, type: "internal", group: "seo" },
    { name: "Robots.txt", url: `${SITE_BASE}/robots.txt`, type: "internal", group: "seo" },
];

const caseStudyTargets: StatusTarget[] = caseStudies.map((study) => ({
    name: study.title,
    url: `${SITE_BASE}/work/${study.slug}/`,
    type: "internal" as const,
    group: "case-study" as const,
}));

const external: StatusTarget[] = [
    {
        name: "GitHub API",
        url: "https://api.github.com/users/im-rihan",
        type: "external",
        group: "external",
    },
    {
        name: "GitHub Profile",
        url: "https://github.com/im-rihan",
        type: "external",
        group: "external",
    },
    {
        name: "LinkedIn",
        url: "https://linkedin.com/in/im-rihan",
        type: "external",
        group: "external",
    },
];

export const statusGroupLabels: Record<StatusGroup | "all", string> = {
    all: "All",
    page: "Pages",
    asset: "Assets",
    "case-study": "Case studies",
    seo: "SEO",
    external: "External",
};

export const statusTargets: StatusTarget[] = [
    ...corePages,
    ...assets,
    ...seo,
    ...caseStudyTargets,
    ...external,
];
