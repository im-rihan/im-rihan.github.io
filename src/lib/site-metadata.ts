import type { Metadata, Viewport } from "next";
import { siteMeta } from "@/data/profile";

const siteUrl = "https://im-rihan.github.io";

const ogImageAlt = `${siteMeta.name} — ${siteMeta.title}`;

const defaultOgImages = [
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

function pagePath(path?: string): string {
    if (!path || path === "/") return siteUrl;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${siteUrl}${normalized.endsWith("/") ? normalized : `${normalized}/`}`;
}

function resolveOgImages(custom?: string) {
    if (!custom) return [...defaultOgImages];
    const image = {
        url: custom,
        width: 1200,
        height: 630,
        alt: ogImageAlt,
        type: custom.endsWith(".svg") ? "image/svg+xml" : "image/png",
    };
    return [image, ...defaultOgImages];
}

function socialMetadata(
    page: string,
    description?: string,
    path?: string,
    opts?: { ogImage?: string; ogType?: "website" | "article" },
) {
    const title = pageTitle(page);
    const desc = description ?? siteMeta.description;
    const url = pagePath(path);
    const images = resolveOgImages(opts?.ogImage);
    return {
        openGraph: {
            title,
            description: desc,
            url,
            siteName: siteMeta.name,
            type: opts?.ogType ?? ("website" as const),
            locale: "en_US",
            images,
        },
        twitter: {
            card: "summary_large_image" as const,
            title,
            description: desc,
            images: images.map((img) => img.url),
        },
        alternates: {
            canonical: url,
        },
    };
}

export function pageTitle(page?: string): string {
    if (!page) return `${siteMeta.name} — ${siteMeta.title}`;
    return `${page} · ${siteMeta.name}`;
}

export function createPageMetadata(
    page: string,
    description?: string,
    path?: string,
    opts?: { ogImage?: string; ogType?: "website" | "article" },
): Metadata {
    return {
        title: page,
        description: description ?? siteMeta.description,
        metadataBase: new URL(siteUrl),
        authors: [{ name: siteMeta.name, url: siteUrl }],
        creator: siteMeta.name,
        keywords: [
            "Full Stack Developer",
            "React",
            "Next.js",
            "NestJS",
            "TypeScript",
            "Fintech",
            "Real Estate",
            siteMeta.name,
        ],
        icons: {
            icon: [
                { url: "/favicon.svg", type: "image/svg+xml" },
                { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
                { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
            ],
            apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
        },
        manifest: "/manifest.json",
        ...socialMetadata(page, description, path, opts),
    };
}

export const rootMetadata: Metadata = {
    ...createPageMetadata(siteMeta.title, siteMeta.description, "/"),
    title: {
        default: pageTitle(),
        template: `%s · ${siteMeta.name}`,
    },
};

export const rootViewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: [
        { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
        { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    ],
};

export { siteUrl, defaultOgImages as ogImages };
