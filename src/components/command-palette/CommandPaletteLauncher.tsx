"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";

const CommandPalette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), {
    ssr: false,
    loading: () => null,
});

export const OPEN_COMMAND_PALETTE_EVENT = "command-palette:open";

export function CommandPaletteLauncher() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const isMod = e.metaKey || e.ctrlKey;
            if (isMod && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };
        const onOpenEvent = () => setOpen(true);

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpenEvent);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpenEvent);
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    return (
        <AnimatePresence>
            {open && <CommandPalette key="cmd-palette" onClose={() => setOpen(false)} />}
        </AnimatePresence>
    );
}
