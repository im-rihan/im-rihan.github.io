import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/case-studies";

export const dynamic = "force-static";

const siteUrl = "https://im-rihan.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes = ["", "chat/", "github/", "gallery/", "status/"];
    const now = new Date();

    return [
        ...staticRoutes.map((path) => ({
            url: `${siteUrl}/${path}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: path === "" ? 1 : 0.8,
        })),
        ...caseStudies.map((study) => ({
            url: `${siteUrl}/work/${study.slug}/`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.7,
        })),
    ];
}
