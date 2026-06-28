import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
    return (
        <div className={styles.wrap}>
            <div className={`glass-card ${styles.card}`}>
                <p className={styles.code}>404</p>
                <h1>Page not found</h1>
                <p>The route you requested does not exist on this portfolio.</p>
                <div className={styles.actions}>
                    <Link href="/" className="btn btn-primary">
                        Back to home
                    </Link>
                    <Link href="/chat/" className="btn btn-outline">
                        Portfolio chat
                    </Link>
                </div>
            </div>
        </div>
    );
}
