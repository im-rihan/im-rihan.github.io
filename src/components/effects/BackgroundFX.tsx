import styles from "./BackgroundFX.module.css";

/** CSS-only ambient effects — aurora, grid, scanlines, glow orbs, vignette. */
export function BackgroundFX() {
    return (
        <div className={styles.fx} aria-hidden>
            <div className={styles.aurora} />
            <div className={styles.orbs}>
                <span className={styles.orbA} />
                <span className={styles.orbB} />
                <span className={styles.orbC} />
            </div>
            <div className={styles.horizon} />
            <div className={styles.gridPulse} />
            <div className={styles.scanlines} />
            <div className={styles.noise} />
            <div className={styles.vignette} />
        </div>
    );
}
