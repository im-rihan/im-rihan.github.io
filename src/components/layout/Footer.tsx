import Link from "next/link";
import { siteMeta } from "@/data/profile";
import styles from "./Footer.module.css";

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <p className={styles.copy}>
                    &copy; {year}{" "}
                    <Link href="/" prefetch={false} data-cursor="pointer">
                        {siteMeta.name}
                    </Link>
                    {" · "}
                    {siteMeta.title}
                    {" · "}
                    {siteMeta.location}
                </p>
                <p className={styles.meta}>
                    Built with Next.js · Static export ·{" "}
                    <a
                        href="https://pages.github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="pointer"
                    >
                        GitHub Pages
                    </a>
                </p>
            </div>
        </footer>
    );
}
