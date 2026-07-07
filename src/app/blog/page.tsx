import { Rss } from "lucide-react";
import { sortedBlogPosts } from "@/data/blog-posts";
import { createPageMetadata, siteUrl } from "@/lib/site-metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import { BlogCardList } from "@/components/blog/BlogCardList";
import styles from "./blog.module.css";

const baseMetadata = createPageMetadata(
    "Blog",
    "Notes on building this portfolio and shipping production fintech/real-estate systems — architecture, debugging stories, and lessons learned.",
    "/blog",
);

export const metadata = {
    ...baseMetadata,
    alternates: {
        ...baseMetadata.alternates,
        types: { "application/rss+xml": `${siteUrl}/blog/rss.xml` },
    },
};

const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog/` },
    ],
};

export default function BlogIndexPage() {
    const posts = sortedBlogPosts();

    return (
        <>
            <PageJsonLd data={breadcrumb} />
            <PageHeader
                title="Blog"
                description={
                    <>
                        Notes on building this site and on production engineering — architecture decisions, debugging
                        stories, and lessons that didn&apos;t fit in a case study.
                    </>
                }
            />
            <div className={`container ${styles.page}`}>
                <div className={styles.toolbar}>
                    <a
                        href="/blog/rss.xml"
                        className={styles.rssLink}
                        data-cursor="pointer"
                        aria-label="Subscribe via RSS"
                    >
                        <Rss size={14} aria-hidden />
                        RSS feed
                    </a>
                </div>
                <BlogCardList posts={posts} />
            </div>
        </>
    );
}
