import Link from "next/link";
import styles from "@/app/blog/[slug]/post.module.css";

export function BlogToc({ items }: { items: { id: string; text: string; level: 2 | 3 }[] }) {
    if (items.length < 2) return null;

    return (
        <nav className={`glass-card ${styles.toc}`} aria-label="Table of contents">
            <h2 className={styles.tocTitle}>On this page</h2>
            <ol className={styles.tocList}>
                {items.map((item) => (
                    <li key={item.id} className={item.level === 3 ? styles.tocNested : undefined}>
                        <a href={`#${item.id}`} data-cursor="pointer">
                            {item.text}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

export function BlogPostNav({
    prev,
    next,
    related,
}: {
    prev: { slug: string; title: string } | null;
    next: { slug: string; title: string } | null;
    related: { slug: string; title: string; excerpt: string }[];
}) {
    return (
        <div className={styles.postNav}>
            <div className={styles.adjacent}>
                {prev ? (
                    <Link href={`/blog/${prev.slug}/`} prefetch={false} className={styles.adjacentLink} data-cursor="pointer">
                        <span>Older</span>
                        <strong>{prev.title}</strong>
                    </Link>
                ) : (
                    <span />
                )}
                {next ? (
                    <Link
                        href={`/blog/${next.slug}/`}
                        prefetch={false}
                        className={`${styles.adjacentLink} ${styles.adjacentNext}`}
                        data-cursor="pointer"
                    >
                        <span>Newer</span>
                        <strong>{next.title}</strong>
                    </Link>
                ) : (
                    <span />
                )}
            </div>

            {related.length > 0 && (
                <section className={styles.related}>
                    <h2>Related posts</h2>
                    <div className={styles.relatedGrid}>
                        {related.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}/`}
                                prefetch={false}
                                className={`glass-card ${styles.relatedCard}`}
                                data-cursor="pointer"
                            >
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
