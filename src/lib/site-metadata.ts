import type { Metadata, Viewport } from "next";
import { siteMeta } from "@/data/profile";

const siteUrl = "https://im-rihan.github.io";

const ogImageAlt = `${siteMeta.name} — ${siteMeta.title}`;

const ogImages = [
    {
        url: "/og-image-dark.png",
        width: 1200,
        height: 630,
        alt: ogImageAlt,
        type: "image/png",
    },
    {
        url: "/og-image-light.png",
        width: 1200,
        height: 630,
        alt: ogImageAlt,
        type: "image/png",
    },
] as const;

function socialMetadata(page: string, description?: string) {
    const title = pageTitle(page);
    const desc = description ?? siteMeta.description;
    return {
        openGraph: {
            title,
            description: desc,
            url: siteUrl,
            siteName: siteMeta.name,
            type: "website" as const,
            locale: "en_US",
            images: [...ogImages],
        },
        twitter: {
            card: "summary_large_image" as const,
            title,
            description: desc,
            images: [ogImages[0].url, ogImages[1].url],
        },
    };
}

export function pageTitle(page?: string): string {
    if (!page) return `${siteMeta.name} — ${siteMeta.title}`;
    return `${page} · ${siteMeta.name}`;
}

export function createPageMetadata(page: string, description?: string): Metadata {
    return {
        title: page,
        description: description ?? siteMeta.description,
        metadataBase: new URL(siteUrl),
        icons: {
            icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
            apple: [{ url: "/brand-logo-dark.svg", type: "image/svg+xml" }],
        },
        ...socialMetadata(page, description),
    };
}

export const rootMetadata: Metadata = {
    ...createPageMetadata(siteMeta.title),
    title: {
        default: pageTitle(),
        template: `%s · ${siteMeta.name}`,
    },
};

export const rootViewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};
