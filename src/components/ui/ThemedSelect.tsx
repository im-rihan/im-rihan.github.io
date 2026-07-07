"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./ThemedSelect.module.css";

export interface SelectOption {
    value: string;
    label: string;
}

interface ThemedSelectProps {
    name: string;
    value: string;
    onChange: (value: string) => void;
    options: readonly SelectOption[];
    required?: boolean;
    "aria-label"?: string;
}

export function ThemedSelect({
    name,
    value,
    onChange,
    options,
    required,
    "aria-label": ariaLabel,
}: ThemedSelectProps) {
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState(() => Math.max(0, options.findIndex((o) => o.value === value)));
    const [prevValue, setPrevValue] = useState(value);
    const wrapRef = useRef<HTMLDivElement>(null);
    const listId = useId();

    const selected = options.find((o) => o.value === value) ?? options[0];

    // Sync highlight with controlled value during render — avoids an extra useEffect pass.
    if (prevValue !== value) {
        setPrevValue(value);
        const idx = options.findIndex((o) => o.value === value);
        setHighlight(idx >= 0 ? idx : 0);
    }

    useEffect(() => {
        const onPointerDown = (event: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, []);

    function pick(index: number) {
        const opt = options[index];
        if (!opt) return;
        onChange(opt.value);
        setOpen(false);
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
        if (!open && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            setOpen(true);
            return;
        }
        if (!open) return;

        if (event.key === "Escape") {
            setOpen(false);
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            setHighlight((i) => (i + 1) % options.length);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setHighlight((i) => (i - 1 + options.length) % options.length);
        } else if (event.key === "Enter") {
            event.preventDefault();
            pick(highlight);
        }
    }

    return (
        <div className={styles.wrap} ref={wrapRef}>
            <input type="hidden" name={name} value={value} required={required} />
            <button
                type="button"
                className={styles.trigger}
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => setOpen((o) => !o)}
                onKeyDown={onKeyDown}
            >
                <span>{selected.label}</span>
                <ChevronDown size={16} className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} aria-hidden />
            </button>
            {open && (
                <ul className={styles.menu} id={listId} role="listbox" aria-label={ariaLabel}>
                    {options.map((opt, i) => (
                        // Keyboard selection already works via the trigger button's onKeyDown
                        // (Arrow keys move `highlight`, Enter calls pick()); options are
                        // intentionally not individually focusable, so no separate keyboard
                        // listener belongs on this element.
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                        <li
                            key={opt.value}
                            role="option"
                            aria-selected={opt.value === value}
                            className={`${styles.option} ${opt.value === value ? styles.optionSelected : ""} ${i === highlight ? styles.optionHighlighted : ""}`}
                            onMouseEnter={() => setHighlight(i)}
                            onClick={() => pick(i)}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
