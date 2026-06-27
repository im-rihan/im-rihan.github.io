"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useSpring } from "framer-motion";
import {
    emitCursorBurst,
    setCursorCharge,
    setCursorDragging,
    setCursorIdle,
    setCursorPointer,
    setCursorVelocity,
} from "@/lib/cursor-signals";
import styles from "./CustomCursor.module.css";

type CursorMode = "default" | "pointer" | "card" | "text" | "nav";

interface TrailDot {
    id: string;
    x: number;
    y: number;
}

interface Ripple {
    id: string;
    x: number;
    y: number;
    power: number;
}

interface Spark {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
}

const TRAIL_LENGTH = 16;
const MAGNETIC_SELECTOR = "a, button, .btn, .glass-card, [data-tilt-card], [data-cursor]";
const NAV_SELECTOR = "[data-cursor='nav']";
const SATELLITE_COUNT = 6;

function toNdc(x: number, y: number) {
    return {
        nx: (x / window.innerWidth) * 2 - 1,
        ny: -((y / window.innerHeight) * 2 - 1),
    };
}

export function CustomCursor() {
    const [enabled, setEnabled] = useState(false);
    const [visible, setVisible] = useState(false);
    const [mode, setMode] = useState<CursorMode>("default");
    const [clicking, setClicking] = useState(false);
    const [charge, setCharge] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [velocityAngle, setVelocityAngle] = useState(0);
    const [idle, setIdle] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [trail, setTrail] = useState<TrailDot[]>([]);
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const [sparks, setSparks] = useState<Spark[]>([]);
    const lastTrailAt = useRef(0);
    const lastMoveAt = useRef(performance.now());
    const lastNdc = useRef({ nx: 0, ny: 0 });
    const chargeStart = useRef(0);
    const pointerRef = useRef({ x: 0, y: 0 });
    const chargeRaf = useRef<number | null>(null);
    const chargeRef = useRef(0);
    const modeRef = useRef<CursorMode>("default");
    const rapidClicks = useRef<number[]>([]);
    const paintCanvasRef = useRef<HTMLCanvasElement>(null);
    const isDownRef = useRef(false);
    const didDragRef = useRef(false);
    const pressAtRef = useRef(0);
    const pressPosRef = useRef({ x: 0, y: 0 });
    const lastPaintRef = useRef({ x: 0, y: 0 });
    const paintFadeRaf = useRef<number | null>(null);

    const dotX = useSpring(0, { stiffness: 1200, damping: 50, mass: 0.15 });
    const dotY = useSpring(0, { stiffness: 1200, damping: 50, mass: 0.15 });
    const ringX = useSpring(0, { stiffness: 180, damping: 22, mass: 0.5 });
    const ringY = useSpring(0, { stiffness: 180, damping: 22, mass: 0.5 });
    const glowX = useSpring(0, { stiffness: 80, damping: 25, mass: 1.2 });
    const glowY = useSpring(0, { stiffness: 80, damping: 25, mass: 1.2 });
    const orbitX = useSpring(0, { stiffness: 140, damping: 30, mass: 0.8 });
    const orbitY = useSpring(0, { stiffness: 140, damping: 30, mass: 0.8 });
    const ringOuterX = useSpring(0, { stiffness: 120, damping: 28, mass: 0.9 });
    const ringOuterY = useSpring(0, { stiffness: 120, damping: 28, mass: 0.9 });

    const resolveMode = useCallback((target: EventTarget | null): CursorMode => {
        if (!(target instanceof Element)) return "default";
        const el = target.closest("[data-cursor]");
        if (el) return (el.getAttribute("data-cursor") as CursorMode) || "default";
        if (target.closest("a, button, .btn, input, textarea, select, label, [role='button']")) return "pointer";
        if (target.closest(".glass-card, [data-tilt-card]")) return "card";
        if (target.closest("p, h1, h2, h3, h4, span")) return "text";
        return "default";
    }, []);

    const resolveMagneticOffset = useCallback((target: EventTarget | null, clientX: number, clientY: number, cursorMode: CursorMode) => {
        if (!(target instanceof Element)) return { x: 0, y: 0 };
        const navEl = target.closest(NAV_SELECTOR) as HTMLElement | null;
        if (navEl && cursorMode === "nav") {
            const rect = navEl.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = cx - clientX;
            const dy = cy - clientY;
            const dist = Math.hypot(dx, dy);
            if (dist > 120) return { x: 0, y: 0 };
            const pull = Math.min(18, dist * 0.35);
            const angle = Math.atan2(dy, dx);
            return { x: Math.cos(angle) * pull, y: Math.sin(angle) * pull };
        }
        const el = target.closest(MAGNETIC_SELECTOR) as HTMLElement | null;
        if (!el) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - clientX;
        const dy = cy - clientY;
        const dist = Math.hypot(dx, dy);
        const strength = cursorMode === "pointer" ? 0.45 : cursorMode === "nav" ? 0.38 : cursorMode === "card" ? 0.28 : 0.15;
        const maxPull = 56;
        if (dist > 180) return { x: 0, y: 0 };
        const pull = Math.min(maxPull, dist * strength);
        const angle = Math.atan2(dy, dx);
        return { x: Math.cos(angle) * pull, y: Math.sin(angle) * pull };
    }, []);

    const paintStroke = useCallback((x: number, y: number) => {
        const canvas = paintCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { x: lx, y: ly } = lastPaintRef.current;
        const dist = Math.hypot(x - lx, y - ly);
        if (dist < 2) return;

        ctx.strokeStyle = chargeRef.current > 0.35
            ? `rgba(245, 158, 11, ${0.45 + chargeRef.current * 0.35})`
            : "rgba(20, 184, 166, 0.5)";
        ctx.lineWidth = 1.2 + chargeRef.current * 2.2 + Math.min(dist * 0.08, 2);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowBlur = 10;
        ctx.shadowColor = chargeRef.current > 0.35 ? "#f59e0b" : "#14b8a6";
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(x, y);
        ctx.stroke();
        lastPaintRef.current = { x, y };
    }, []);

    const spawnRipple = useCallback((x: number, y: number, power: number) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setRipples((prev) => [...prev.slice(-6), { id, x, y, power }]);
        window.setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 720);
    }, []);

    const spawnSparks = useCallback((x: number, y: number, count: number, power: number) => {
        const next: Spark[] = Array.from({ length: count }, (_, i) => {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
            const spd = 1.2 + Math.random() * 2.4 * power;
            return {
                id: `${Date.now()}-s${i}-${Math.random().toString(36).slice(2, 5)}`,
                x,
                y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                life: 1,
            };
        });
        setSparks((prev) => [...prev.slice(-32), ...next]);
    }, []);

    const fireBurst = useCallback((x: number, y: number, power: number, opts?: { visualOnly?: boolean }) => {
        const clamped = Math.max(0.18, Math.min(0.85, power));
        if (!opts?.visualOnly) {
            const { nx, ny } = toNdc(x, y);
            emitCursorBurst(nx, ny, clamped);
        }
        spawnRipple(x, y, clamped);
        spawnSparks(x, y, Math.round(4 + clamped * 8), clamped);
    }, [spawnRipple, spawnSparks]);

    const stopChargeLoop = useCallback(() => {
        if (chargeRaf.current !== null) {
            cancelAnimationFrame(chargeRaf.current);
            chargeRaf.current = null;
        }
    }, []);

    const startChargeLoop = useCallback(() => {
        stopChargeLoop();
        chargeStart.current = performance.now();

        const tick = () => {
            const elapsed = performance.now() - chargeStart.current;
            const next = Math.min(1, elapsed / 900);
            chargeRef.current = next;
            setCharge(next);
            setCursorCharge(next);
            if (next < 1) {
                chargeRaf.current = requestAnimationFrame(tick);
            }
        };
        chargeRaf.current = requestAnimationFrame(tick);
    }, [stopChargeLoop]);

    useEffect(() => {
        if (!sparks.length) return;
        const id = window.setInterval(() => {
            setSparks((prev) =>
                prev
                    .map((s) => ({
                        ...s,
                        x: s.x + s.vx,
                        y: s.y + s.vy,
                        vy: s.vy + 0.06,
                        life: s.life - 0.06,
                    }))
                    .filter((s) => s.life > 0)
            );
        }, 16);
        return () => window.clearInterval(id);
    }, [sparks.length]);

    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isCoarse = window.matchMedia("(pointer: coarse)").matches;
        if (prefersReduced || isCoarse) return;

        setEnabled(true);
        document.body.classList.add("custom-cursor");

        if (!sessionStorage.getItem("cursor-play-hint")) {
            setShowHint(true);
            sessionStorage.setItem("cursor-play-hint", "1");
            window.setTimeout(() => setShowHint(false), 6000);
        }

        const resizePaint = () => {
            const canvas = paintCanvasRef.current;
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizePaint();
        window.addEventListener("resize", resizePaint);

        const fadePaint = () => {
            const canvas = paintCanvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (ctx && canvas) {
                ctx.globalCompositeOperation = "destination-out";
                ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = "source-over";
            }
            paintFadeRaf.current = requestAnimationFrame(fadePaint);
        };
        paintFadeRaf.current = requestAnimationFrame(fadePaint);

        const idleCheck = window.setInterval(() => {
            const ms = performance.now() - lastMoveAt.current;
            setIdle(ms > 1800);
            setCursorIdle(ms);
        }, 200);

        const move = (e: MouseEvent) => {
            const nextMode = resolveMode(e.target);
            modeRef.current = nextMode;
            setMode(nextMode);
            const magnetic = resolveMagneticOffset(e.target, e.clientX, e.clientY, nextMode);
            pointerRef.current = { x: e.clientX, y: e.clientY };

            const { nx, ny } = toNdc(e.clientX, e.clientY);
            const vnx = nx - lastNdc.current.nx;
            const vny = ny - lastNdc.current.ny;
            const spd = Math.hypot(vnx, vny);
            lastNdc.current = { nx, ny };
            setSpeed(spd);
            if (spd > 0.004) {
                setVelocityAngle(Math.atan2(vny, vnx) * (180 / Math.PI));
            }
            setCursorVelocity(vnx, vny);
            setCursorPointer(nx, ny);
            lastMoveAt.current = performance.now();

            if (isDownRef.current && modeRef.current === "default") {
                const dx = e.clientX - pressPosRef.current.x;
                const dy = e.clientY - pressPosRef.current.y;
                if (Math.hypot(dx, dy) > 10) {
                    didDragRef.current = true;
                    paintStroke(e.clientX, e.clientY);
                }
            }

            dotX.set(e.clientX);
            dotY.set(e.clientY);
            ringX.set(e.clientX + magnetic.x);
            ringY.set(e.clientY + magnetic.y);
            glowX.set(e.clientX);
            glowY.set(e.clientY);
            orbitX.set(e.clientX + magnetic.x * 0.5);
            orbitY.set(e.clientY + magnetic.y * 0.5);
            ringOuterX.set(e.clientX + magnetic.x * 0.35);
            ringOuterY.set(e.clientY + magnetic.y * 0.35);

            document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
            document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
            document.documentElement.style.setProperty("--mouse-nx", String(nx));
            document.documentElement.style.setProperty("--mouse-ny", String(ny));
            document.documentElement.style.setProperty("--cursor-charge", String(chargeRef.current));
            document.documentElement.style.setProperty("--cursor-speed", String(spd));

            if (spd > 0.022 && Math.random() < spd * 1.8) {
                spawnSparks(
                    e.clientX + (Math.random() - 0.5) * 8,
                    e.clientY + (Math.random() - 0.5) * 8,
                    1,
                    Math.min(0.5, spd * 4)
                );
            }

            const now = performance.now();
            if (now - lastTrailAt.current > 20) {
                lastTrailAt.current = now;
                const pointId = `${now}-${Math.random().toString(36).slice(2, 8)}`;
                setTrail((prev) => [
                    { id: pointId, x: e.clientX, y: e.clientY },
                    ...prev.slice(0, TRAIL_LENGTH - 1),
                ]);
            }

            setVisible(true);
        };

        const down = (e: MouseEvent) => {
            if (e.button !== 0) return;
            const nextMode = resolveMode(e.target);
            modeRef.current = nextMode;
            setClicking(true);
            isDownRef.current = true;
            didDragRef.current = false;
            pressAtRef.current = performance.now();
            pressPosRef.current = { x: e.clientX, y: e.clientY };
            lastPaintRef.current = { x: e.clientX, y: e.clientY };
            setCursorDragging(nextMode === "default");
            startChargeLoop();
        };

        const up = () => {
            const { x, y } = pointerRef.current;
            const held = performance.now() - pressAtRef.current;
            const moved = Math.hypot(x - pressPosRef.current.x, y - pressPosRef.current.y);
            const mode = modeRef.current;
            const currentCharge = chargeRef.current;

            if (mode === "default" && !didDragRef.current && moved < 12) {
                if (held < 260) {
                    fireBurst(x, y, 0.24);
                    const now = performance.now();
                    rapidClicks.current = [...rapidClicks.current.filter((t) => now - t < 700), now];
                    if (rapidClicks.current.length >= 4) {
                        rapidClicks.current = [];
                        fireBurst(x, y, 0.88);
                    }
                } else if (currentCharge > 0.42) {
                    const power = 0.42 + currentCharge * 0.38;
                    fireBurst(x, y, power);
                } else {
                    fireBurst(x, y, 0.3, { visualOnly: true });
                }
            } else if (mode === "default" && didDragRef.current && currentCharge > 0.72) {
                fireBurst(x, y, 0.48);
            }

            setClicking(false);
            isDownRef.current = false;
            didDragRef.current = false;
            setCursorDragging(false);
            chargeRef.current = 0;
            setCharge(0);
            setCursorCharge(0);
            stopChargeLoop();
        };

        const leave = () => setVisible(false);
        const enter = () => setVisible(true);

        window.addEventListener("mousemove", move);
        window.addEventListener("mousedown", down);
        window.addEventListener("mouseup", up);
        document.documentElement.addEventListener("mouseleave", leave);
        document.documentElement.addEventListener("mouseenter", enter);

        return () => {
            document.body.classList.remove("custom-cursor");
            stopChargeLoop();
            if (paintFadeRaf.current !== null) cancelAnimationFrame(paintFadeRaf.current);
            window.clearInterval(idleCheck);
            window.removeEventListener("resize", resizePaint);
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mousedown", down);
            window.removeEventListener("mouseup", up);
            document.documentElement.removeEventListener("mouseleave", leave);
            document.documentElement.removeEventListener("mouseenter", enter);
        };
    }, [
        dotX,
        dotY,
        ringX,
        ringY,
        glowX,
        glowY,
        orbitX,
        orbitY,
        ringOuterX,
        ringOuterY,
        resolveMode,
        resolveMagneticOffset,
        fireBurst,
        startChargeLoop,
        stopChargeLoop,
        paintStroke,
    ]);

    if (!enabled || !visible) return null;

    const modeClass =
        mode === "pointer" ? styles.pointer :
        mode === "nav" ? styles.nav :
        mode === "card" ? styles.card :
        mode === "text" ? styles.text :
        styles.default;

    const chargeScale = 1 + charge * 0.55;
    const crossLen = 8 + Math.min(speed * 28, 22);

    return (
        <>
            <canvas ref={paintCanvasRef} className={styles.paintCanvas} aria-hidden />
            {showHint && mode === "default" && (
                <div className={styles.playHint} aria-hidden>
                    Click · hold to charge · drag to paint
                </div>
            )}
            <motion.div
                className={styles.glow}
                style={{ x: glowX, y: glowY, scale: chargeScale + speed * 0.15 }}
                aria-hidden
            />
            {speed > 0.012 && mode === "default" && !clicking && (
                <motion.div
                    className={styles.cometTail}
                    style={{
                        x: dotX,
                        y: dotY,
                        rotate: velocityAngle,
                        scaleX: 1 + Math.min(speed * 32, 2.8),
                        opacity: Math.min(speed * 2.2, 0.75),
                    }}
                    aria-hidden
                />
            )}
            {speed > 0.04 && mode === "default" && (
                <motion.div
                    className={styles.cometCore}
                    style={{
                        x: dotX,
                        y: dotY,
                        rotate: velocityAngle,
                        scaleX: 1.2 + Math.min(speed * 20, 2),
                        opacity: Math.min(speed * 1.6, 0.55),
                    }}
                    aria-hidden
                />
            )}
            {mode === "default" && (
                <motion.div className={styles.microOrbit} style={{ x: dotX, y: dotY }} aria-hidden>
                    {Array.from({ length: 10 }, (_, i) => (
                        <span key={i} className={styles.microParticle} style={{ ["--i" as string]: i }} />
                    ))}
                </motion.div>
            )}
            {mode === "default" && (
                <motion.div
                    className={`${styles.hexRing} ${charge > 0.35 ? styles.hexCharged : ""}`}
                    style={{ x: orbitX, y: orbitY, rotate: velocityAngle * 0.5 + charge * 45 }}
                    aria-hidden
                />
            )}
            <motion.div
                className={`${styles.orbit} ${modeClass} ${charge > 0.2 ? styles.charging : ""} ${idle ? styles.idle : ""}`}
                style={{ x: orbitX, y: orbitY, scale: chargeScale }}
                aria-hidden
            >
                {mode === "default" &&
                    Array.from({ length: SATELLITE_COUNT }, (_, i) => (
                        <span
                            key={i}
                            className={styles.satellite}
                            style={{ ["--sat-i" as string]: i }}
                            aria-hidden
                        />
                    ))}
            </motion.div>
            {mode === "default" && !clicking && charge < 0.12 && (
                <>
                    <motion.div
                        className={styles.crosshair}
                        style={{ x: dotX, y: dotY, rotate: speed * 12 }}
                        aria-hidden
                    >
                        <span className={styles.crossH} style={{ width: crossLen * 2 }} />
                        <span className={styles.crossV} style={{ height: crossLen * 2 }} />
                    </motion.div>
                    <motion.div
                        className={`${styles.ringOuter} ${charge > 0.3 ? styles.charging : ""}`}
                        style={{ x: ringOuterX, y: ringOuterY, scale: 1 + speed * 0.2 }}
                        aria-hidden
                    />
                </>
            )}
            {ripples.map((r) => (
                <span
                    key={r.id}
                    className={styles.ripple}
                    style={{
                        left: r.x,
                        top: r.y,
                        ["--ripple-power" as string]: r.power,
                    }}
                    aria-hidden
                />
            ))}
            {sparks.map((s) => (
                <span
                    key={s.id}
                    className={styles.spark}
                    style={{
                        transform: `translate(${s.x}px, ${s.y}px) scale(${0.4 + s.life * 0.6})`,
                        opacity: s.life,
                    }}
                    aria-hidden
                />
            ))}
            {trail.map((t, i) => (
                <span
                    key={t.id}
                    className={styles.trail}
                    style={{
                        transform: `translate(${t.x}px, ${t.y}px)`,
                        opacity: Math.max(0, 0.55 - i * 0.035),
                        width: Math.max(2, 8 - i * 0.4),
                        height: Math.max(2, 8 - i * 0.4),
                        marginLeft: Math.max(-1.5, -(4 - i * 0.2)),
                        marginTop: Math.max(-1.5, -(4 - i * 0.2)),
                    }}
                    aria-hidden
                />
            ))}
            <motion.div
                className={`${styles.ring} ${modeClass} ${clicking ? styles.clicking : ""} ${charge > 0.55 ? styles.charged : ""}`}
                style={{ x: ringX, y: ringY, scale: chargeScale }}
                aria-hidden
            />
            <motion.div
                className={`${styles.dot} ${modeClass} ${clicking ? styles.clicking : ""}`}
                style={{ x: dotX, y: dotY }}
                aria-hidden
            />
            {charge > 0.08 && mode === "default" && (
                <motion.div
                    className={styles.chargeTicks}
                    style={{ x: ringX, y: ringY, rotate: charge * 120 }}
                    aria-hidden
                >
                    {Array.from({ length: 8 }, (_, i) => (
                        <span
                            key={i}
                            className={styles.chargeTick}
                            style={{
                                ["--tick-i" as string]: i,
                                opacity: charge > (i + 1) / 8 ? 1 : 0.18,
                            }}
                        />
                    ))}
                </motion.div>
            )}
            {charge > 0.15 && mode === "default" && (
                <motion.div
                    className={styles.chargeArc}
                    style={{ x: ringX, y: ringY, rotate: charge * 360 }}
                    aria-hidden
                />
            )}
            {idle && mode === "default" && (
                <motion.div
                    className={styles.idlePulse}
                    style={{ x: ringX, y: ringY }}
                    aria-hidden
                />
            )}
        </>
    );
}
