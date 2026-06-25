"use client";

import { useState } from "react";
import { galleryItems } from "@/data/gallery";
import { FadeIn } from "@/components/effects/FadeIn";
import styles from "./GalleryGrid.module.css";

export function GalleryGrid() {
    const [lightbox, setLightbox] = useState<(typeof galleryItems)[0] | null>(null);

    return (
        <>
            <div className={styles.grid}>
                {galleryItems.map((item, i) => (
                    <FadeIn key={item.id} delay={i * 0.05} className="card-cell">
                        <button
                            type="button"
                            className={styles.card}
                            data-cursor="card"
                            onClick={() => setLightbox(item)}
                            style={{ background: item.gradient }}
                        >
                            <span className={styles.category}>{item.category}</span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </button>
                    </FadeIn>
                ))}
            </div>
            {lightbox && (
                <div className={styles.lightbox} onClick={() => setLightbox(null)} role="dialog">
                    <div
                        className={styles.lightboxInner}
                        onClick={(e) => e.stopPropagation()}
                        style={{ background: lightbox.gradient }}
                    >
                        <span className={styles.category}>{lightbox.category}</span>
                        <h2>{lightbox.title}</h2>
                        <p>{lightbox.description}</p>
                        <p className={styles.hint}>Replace with your photo in src/data/gallery.ts</p>
                        <button type="button" onClick={() => setLightbox(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
