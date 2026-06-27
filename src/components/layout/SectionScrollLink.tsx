"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { navigateToSection } from "@/lib/scroll-to-section";

function normalizePath(path: string): string {
    if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
    return path;
}

type SectionScrollLinkProps = {
    sectionId: string;
    children: ReactNode;
    className?: string;
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
} & Omit<React.ComponentPropsWithoutRef<typeof Link>, "href" | "onClick" | "children">;

/** Same smooth scroll + nav offset as navbar section links. */
export function SectionScrollLink({
    sectionId,
    children,
    className,
    onClick,
    ...rest
}: SectionScrollLinkProps) {
    const pathname = normalizePath(usePathname());
    const href = `/#${sectionId}`;

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;

        if (pathname === "/") {
            e.preventDefault();
            navigateToSection(sectionId);
        }
    };

    return (
        <Link href={href} className={className} onClick={handleClick} {...rest}>
            {children}
        </Link>
    );
}
