"use client";

import Link from "next/link";
import { ArrowRight, Calendar, FileText } from "lucide-react";
import { FadeIn } from "@/components/effects/FadeIn";
import type { BlogPost } from "@/data/blog-posts";
import { estimateReadingMinutes, formatBlogDate } from "@/data/blog-posts";
import styles from "@/app/blog/blog.module.css";

export function BlogCardList({ posts }: { posts: BlogPost[] }) {
    return (
        <div className={styles.grid}>
            {posts.map((post, i) => (
                <FadeIn key={post.slug} delay={i * 0.06}>
                    <Link
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
                </FadeIn>
            ))}
        </div>
    );
}
