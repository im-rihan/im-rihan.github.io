import Link from "next/link";
import { ArrowRight, Calendar, FileText } from "lucide-react";
import { estimateReadingMinutes, formatBlogDate, sortedBlogPosts } from "@/data/blog-posts";
import { createPageMetadata, siteUrl } from "@/lib/site-metadata";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import styles from "./blog.module.css";

export const metadata = createPageMetadata(
    "Blog",
    "Notes on building this portfolio and shipping production fintech/real-estate systems — architecture, debugging stories, and lessons learned.",
    "/blog",
);

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
                <div className={styles.grid}>
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}/`}
                            prefetch={false}
                            className={`glass-card ${styles.card}`}
                            data-cursor="pointer"
                        >
                            <div className={styles.cardHead}>
                                <FileText size={18} className={styles.icon} aria-hidden />
                                <span className={styles.meta}>
                                    <Calendar size={12} style={{ verticalAlign: -2, marginRight: 4 }} aria-hidden />
                                    {formatBlogDate(post.date)} · {estimateReadingMinutes(post.content)} min read
                                </span>
                            </div>
                            <h2>{post.title}</h2>
                            <p className={styles.excerpt}>{post.excerpt}</p>
                            <div className={styles.tags}>
                                {post.tags.map((tag) => (
                                    <span key={tag} className={styles.tag}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <span className={styles.cta}>
                                Read post
                                <ArrowRight size={16} aria-hidden />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
