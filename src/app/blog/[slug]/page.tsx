import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { blogPosts, estimateReadingMinutes, formatBlogDate, getBlogPost } from "@/data/blog-posts";
import { createPageMetadata, siteUrl } from "@/lib/site-metadata";
import { siteMeta } from "@/data/profile";
import { PageHeader } from "@/components/layout/PageHeader";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import { PageJsonLd } from "@/components/seo/PageJsonLd";
import styles from "./post.module.css";

export function generateStaticParams() {
    return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getBlogPost(slug);
    if (!post) return {};
    return createPageMetadata(post.title, post.excerpt, `/blog/${slug}`, {
        ogImage: post.ogImage,
        ogType: "article",
    });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getBlogPost(slug);
    if (!post) notFound();

    const postUrl = `${siteUrl}/blog/${slug}/`;

    const blogPosting = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        url: postUrl,
        keywords: post.tags.join(", "),
        author: { "@type": "Person", name: siteMeta.name, url: siteUrl },
        publisher: { "@type": "Person", name: siteMeta.name, url: siteUrl },
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    };

    const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog/` },
            { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
        ],
    };

    return (
        <>
            <PageJsonLd data={[blogPosting, breadcrumb]} />
            <PageHeader title={post.title} description={post.excerpt} />
            <div className={`container ${styles.page}`}>
                <div className={styles.meta}>
                    <span className={styles.metaItem}>
                        <Calendar size={13} aria-hidden />
                        {formatBlogDate(post.date)}
                    </span>
                    <span className={styles.metaItem}>
                        <Clock size={13} aria-hidden />
                        {estimateReadingMinutes(post.content)} min read
                    </span>
                </div>

                <div className={styles.tags}>
                    {post.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                            {tag}
                        </span>
                    ))}
                </div>

                <section className={`glass-card ${styles.block}`}>
                    <BlogMarkdown source={post.content} />
                </section>

                <Link href="/blog/" prefetch={false} className={styles.back} data-cursor="pointer">
                    <ArrowLeft size={16} aria-hidden />
                    All posts
                </Link>
            </div>
        </>
    );
}
