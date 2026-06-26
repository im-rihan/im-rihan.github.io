export type CursorBurst = {
    id: string;
    /** Normalized device coords — same space as R3F pointer (-1..1) */
    nx: number;
    ny: number;
    power: number;
    at: number;
};

type Listener = (bursts: CursorBurst[]) => void;

const listeners = new Set<Listener>();

let charge = 0;
let pointerNx = 0;
let pointerNy = 0;
let velocityNx = 0;
let velocityNy = 0;
let speed = 0;
let dragging = false;
let idleMs = 0;

export function setCursorPointer(nx: number, ny: number) {
    pointerNx = nx;
    pointerNy = ny;
}

export function setCursorVelocity(vx: number, vy: number) {
    velocityNx = vx;
    velocityNy = vy;
    speed = Math.hypot(vx, vy);
}

export function setCursorIdle(idle: number) {
    idleMs = idle;
}

export function setCursorDragging(value: boolean) {
    dragging = value;
    notify([]);
}

export function setCursorCharge(value: number) {
    charge = Math.max(0, Math.min(1, value));
    notify([]);
}

export function getCursorCharge() {
    return charge;
}

export function getCursorPointer() {
    return { nx: pointerNx, ny: pointerNy };
}

export function getCursorVelocity() {
    return { vx: velocityNx, vy: velocityNy, speed };
}

export function getCursorIdle() {
    return idleMs;
}

export function isCursorDragging() {
    return dragging;
}

export function emitCursorBurst(nx: number, ny: number, power: number) {
    notify([
        {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            nx,
            ny,
            power: Math.max(0.2, Math.min(1, power)),
            at: performance.now(),
        },
    ]);
}

export function subscribeCursorSignals(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

function notify(bursts: CursorBurst[]) {
    listeners.forEach((l) => l(bursts));
}
