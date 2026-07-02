import Link from "next/link";
import { LogoMark } from "./LogoMark";
import styles from "./Logo.module.css";

interface LogoProps {
    compact?: boolean;
    onNavigate?: () => void;
}

export function Logo({ compact = false, onNavigate }: LogoProps) {
    return (
        <Link href="/" prefetch={false} className={styles.logo} aria-label="Rihan Mohammed — Home" onClick={onNavigate} data-cursor="nav">
            <span className={styles.mark}>
                <LogoMark />
            </span>
            {!compact && (
                <span className={styles.wordmark}>
                    <span className={styles.name}>Rihan</span>
                    <span className={styles.surname}>Mohammed</span>
                </span>
            )}
        </Link>
    );
}
