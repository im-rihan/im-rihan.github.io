"use client";

import dynamic from "next/dynamic";
import styles from "./Scene3D.module.css";

const SceneCanvas = dynamic(() => import("./SceneCanvas").then((m) => m.SceneCanvas), {
    ssr: false,
    loading: () => null,
});

export function Scene3D() {
    return (
        <div className={styles.wrapper} aria-hidden>
            <SceneCanvas />
        </div>
    );
}
