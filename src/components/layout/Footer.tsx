import Link from "next/link";
import { siteMeta } from "@/data/profile";
import styles from "./Footer.module.css";

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <p>
                    &copy; {year}{" "}
                    <Link href="/">{siteMeta.name}</Link> · {siteMeta.location}
                    {" · Built with Next.js · Hosted on "}
                    <a href="https://pages.github.com" target="_blank" rel="noopener noreferrer">
                        GitHub Pages
                    </a>
                </p>
            </div>
        </footer>
    );
}
