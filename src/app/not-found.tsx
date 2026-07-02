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
                    <Link href="/" prefetch={false} className="btn btn-primary" data-cursor="pointer">
                        Back to home
                    </Link>
                    <Link href="/chat/" prefetch={false} className="btn btn-outline" data-cursor="pointer">
                        Portfolio chat
                    </Link>
                </div>
            </div>
        </div>
    );
}
