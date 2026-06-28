"use client";

import { useEffect, useRef, useState } from "react";
import { galleryCategories, galleryItems, type GalleryCategory } from "@/data/gallery";
import { FadeIn } from "@/components/effects/FadeIn";
import styles from "./GalleryGrid.module.css";

export function GalleryGrid() {
    const [lightbox, setLightbox] = useState<(typeof galleryItems)[0] | null>(null);
    const [filter, setFilter] = useState<GalleryCategory | "All">("All");
    const closeRef = useRef<HTMLButtonElement>(null);

    const filtered =
        filter === "All" ? galleryItems : galleryItems.filter((item) => item.category === filter);

    useEffect(() => {
        if (!lightbox) return;
        closeRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightbox(null);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [lightbox]);

    return (
        <>
            <div className={styles.filters} role="tablist" aria-label="Gallery categories">
                {(["All", ...galleryCategories] as const).map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        role="tab"
                        aria-selected={filter === cat}
                        className={filter === cat ? styles.activeFilter : ""}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {filtered.map((item, i) => (
                    <FadeIn key={item.id} delay={i * 0.05} className={styles.gridItem}>
                        <button
                            type="button"
                            className={`glass-card ${styles.card}`}
                            data-cursor="card"
                            onClick={() => setLightbox(item)}
                        >
                            <div className={styles.media} style={{ background: item.gradient }} aria-hidden />
                            <div className={styles.body}>
                                <span className={styles.category}>{item.category}</span>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                <span className={styles.openHint}>View →</span>
                            </div>
                        </button>
                    </FadeIn>
                ))}
            </div>

            {lightbox && (
                <div
                    className={styles.lightbox}
                    onClick={() => setLightbox(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="gallery-lightbox-title"
                >
                    <div className={`glass-card ${styles.lightboxInner}`} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.lightboxMedia} style={{ background: lightbox.gradient }} aria-hidden />
                        <div className={styles.lightboxBody}>
                            <span className={styles.category}>{lightbox.category}</span>
                            <h2 id="gallery-lightbox-title">{lightbox.title}</h2>
                            <p>{lightbox.description}</p>
                            <button
                                ref={closeRef}
                                type="button"
                                className={styles.closeBtn}
                                onClick={() => setLightbox(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
