"use client";

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
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
                            <div className={styles.media} style={item.image ? undefined : { background: item.gradient }}>
                                {item.image && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.image} alt="" loading="lazy" className={styles.mediaImg} />
                                )}
                            </div>
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

            <AnimatePresence>
                {lightbox && (
                    // Backdrop is a mouse-only convenience — keyboard users close via Escape or the Close button.
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                    <m.div
                        className={styles.lightbox}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setLightbox(null)}
                    >
                        {/* Stops backdrop dismiss from bubbling — not a primary interaction. */}
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
                        <m.div
                            className={`glass-card ${styles.lightboxInner}`}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="gallery-lightbox-title"
                            initial={{ opacity: 0, scale: 0.88, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.88, y: 20 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className={styles.lightboxMedia}
                                style={lightbox.image ? undefined : { background: lightbox.gradient }}
                            >
                                {lightbox.image && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={lightbox.image} alt="" loading="lazy" className={styles.mediaImg} />
                                )}
                            </div>
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
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
}
