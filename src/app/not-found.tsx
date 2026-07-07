import Link from "next/link";
import { CommandPaletteTrigger } from "@/components/command-palette/CommandPaletteTrigger";
import styles from "./not-found.module.css";

export default function NotFound() {
    return (
        <div className={styles.wrap}>
            <div className={`glass-card ${styles.card}`}>
                <div className={styles.terminal}>
                    <div className={styles.windowDots}>
                        <span className={styles.dotRed} />
                        <span className={styles.dotYellow} />
                        <span className={styles.dotGreen} />
                    </div>
                    <p className={styles.line}>
                        <span className={styles.prompt}>$</span> cd {"{"}requested-page{"}"}
                    </p>
                    <p className={styles.error}>bash: cd: no such file or directory (404)</p>
                </div>

                <h1>Page not found</h1>
                <p>That route doesn&rsquo;t exist on this portfolio — it may have moved or never shipped.</p>

                <div className={styles.actions}>
                    <Link href="/" prefetch={false} className="btn btn-primary" data-cursor="pointer">
                        Back to home
                    </Link>
                    <Link href="/work/" prefetch={false} className="btn btn-outline" data-cursor="pointer">
                        View work
                    </Link>
                    <Link href="/blog/" prefetch={false} className="btn btn-outline" data-cursor="pointer">
                        Read the blog
                    </Link>
                </div>

                <CommandPaletteTrigger />
            </div>
        </div>
    );
}
