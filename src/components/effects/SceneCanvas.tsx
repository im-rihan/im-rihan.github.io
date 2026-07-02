"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Grid, Sparkles, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Group, Mesh, Points } from "three";
import * as THREE from "three";
import { getCursorCharge, getCursorPointer, getCursorVelocity } from "@/lib/cursor-signals";
import { getScrollProgress, advanceScrollProgress } from "@/lib/scene-scroll";
import { getSceneTheme } from "@/lib/scene-theme";
import { SceneInteractions } from "./scene-interactions";
import { SceneProfessional } from "./scene-professional";
import { SceneFuturistic } from "./scene-futuristic";
import { useIsLightTheme } from "./use-scene-theme";
import {
    lerpVec3,
    smoothStep,
    useViewportTracker,
    type Vec3,
    type ViewportRef,
    type ViewportSnapshot,
} from "./scene-viewport";

/** Mobile-only scene tuning — desktop uses hardcoded defaults below. */
const MOBILE = {
    camera: { position: [0, 0.35, 11.8] as Vec3, fov: 54 },
    cameraBaseZ: 11.8,
    focal: { position: [0, 0.5, 0.4] as Vec3, scale: 0.62 },
    globe: {
        outerR: 1.5,
        innerR: 1.0,
        ringR: 1.85,
        floatSpeed: 0.85,
        rotationIntensity: 0.08,
        floatIntensity: 0.18,
    },
    pointer: { x: 0.42, y: 0.28, lookX: 0.2, lookY: 0.12, z: 0.1 },
} as const;

const DESKTOP = {
    camera: { position: [0, 0, 9.4] as Vec3, fov: 48 },
    cameraBaseZ: 9.4,
    pointer: { x: 1.15, y: 0.78, lookX: 0.45, lookY: 0.3, z: 0.25 },
} as const;

function ViewportDriver({ viewportRef }: { viewportRef: ViewportRef }) {
    useFrame((_, delta) => {
        advanceScrollProgress(delta);
        const v = viewportRef.current;
        if (!v) return;
        v.mobileBlend = smoothStep(v.mobileBlend, v.mobileTarget, delta);
    });
    return null;
}

function ResponsiveCamera({ viewportRef }: { viewportRef: ViewportRef }) {
    useFrame((state) => {
        const v = viewportRef.current;
        if (!v) return;

        const t = v.mobileBlend;
        const portrait = THREE.MathUtils.clamp((0.88 - v.aspect) / 0.5, 0, 1);
        const basePos = lerpVec3(DESKTOP.camera.position, MOBILE.camera.position, t);
        const baseZ = THREE.MathUtils.lerp(DESKTOP.cameraBaseZ, MOBILE.cameraBaseZ, t);
        const fov = THREE.MathUtils.lerp(DESKTOP.camera.fov, MOBILE.camera.fov, t) + portrait * 2.2 * Math.max(t, 0.35);
        const pointer = state.pointer;

        const px = THREE.MathUtils.lerp(DESKTOP.pointer.x, MOBILE.pointer.x, t);
        const py = THREE.MathUtils.lerp(DESKTOP.pointer.y, MOBILE.pointer.y, t);
        const pz = THREE.MathUtils.lerp(DESKTOP.pointer.z, MOBILE.pointer.z, t);
        const lookX = THREE.MathUtils.lerp(DESKTOP.pointer.lookX, MOBILE.pointer.lookX, t);
        const lookY = THREE.MathUtils.lerp(DESKTOP.pointer.lookY, MOBILE.pointer.lookY, t);
        const scroll = getScrollProgress();
        const scrollShift = (scroll - 0.5) * 2;

        const { camera } = state;
        if (camera instanceof THREE.PerspectiveCamera) {
            camera.fov = fov;
            camera.updateProjectionMatrix();
        }

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, basePos[0] + pointer.x * px, 0.042);
        camera.position.y = THREE.MathUtils.lerp(
            camera.position.y,
            basePos[1] + pointer.y * py + scrollShift * 0.32 * (1 - t * 0.2),
            0.042
        );
        camera.position.z = THREE.MathUtils.lerp(
            camera.position.z,
            baseZ + portrait * 0.45 + Math.abs(pointer.y) * pz + scroll * 0.55,
            0.028
        );
        camera.lookAt(pointer.x * lookX, pointer.y * lookY + scrollShift * 0.14, 0);
    });
    return null;
}

function AdaptiveFog({ viewportRef, isLight }: { viewportRef: ViewportRef; isLight: boolean }) {
    const { scene } = useThree();
    const theme = getSceneTheme(isLight);

    useFrame(() => {
        const v = viewportRef.current;
        if (!v) return;

        const t = v.mobileBlend;
        const scroll = getScrollProgress();
        const near = THREE.MathUtils.lerp(12, 14, t);
        const far = THREE.MathUtils.lerp(34, 44, t) + scroll * 8;

        if (!(scene.fog instanceof THREE.Fog)) {
            scene.fog = new THREE.Fog(theme.fog, near, far);
            return;
        }

        scene.fog.near = near;
        scene.fog.far = far;
        scene.fog.color.set(theme.fog);
    });

    return null;
}

function SceneFocal({ viewportRef, children }: { viewportRef: ViewportRef; children: ReactNode }) {
    const ref = useRef<Group>(null);

    useFrame(() => {
        const v = viewportRef.current;
        if (!ref.current || !v) return;

        const t = v.mobileBlend;
        const scroll = getScrollProgress();
        ref.current.position.set(
            THREE.MathUtils.lerp(0, MOBILE.focal.position[0], t),
            THREE.MathUtils.lerp(0, MOBILE.focal.position[1], t) + scroll * 0.45,
            THREE.MathUtils.lerp(0, MOBILE.focal.position[2], t) - scroll * 0.9
        );
        ref.current.scale.setScalar(THREE.MathUtils.lerp(1, MOBILE.focal.scale, t) * (1 - scroll * 0.06));
    });

    return <group ref={ref}>{children}</group>;
}

function NebulaMist({ isLight, viewportRef }: { isLight: boolean; viewportRef: ViewportRef }) {
    const theme = getSceneTheme(isLight);
    const ref = useRef<Group>(null);
    const clouds = useMemo(
        () =>
            Array.from({ length: 6 }, (_, i) => ({
                x: (Math.random() - 0.5) * 24,
                y: (Math.random() - 0.5) * 16,
                z: -8 - Math.random() * 8,
                scale: 6 + Math.random() * 9,
                speed: 0.012 + Math.random() * 0.018,
                hue: i % 3 === 0 ? theme.primary : i % 3 === 1 ? theme.accent : theme.purple,
            })),
        [theme.primary, theme.accent, theme.purple]
    );

    useFrame((state) => {
        if (!ref.current) return;
        const t = viewportRef.current?.mobileBlend ?? 0;
        const px = THREE.MathUtils.lerp(0.6, 0.28, t);
        const py = THREE.MathUtils.lerp(0.4, 0.22, t);
        const elapsed = state.clock.elapsedTime;
        ref.current.children.forEach((child, i) => {
            const c = clouds[i];
            child.position.x = c.x + Math.sin(elapsed * c.speed + i) * 0.9 + state.pointer.x * px;
            child.position.y = c.y + Math.cos(elapsed * c.speed * 0.8 + i) * 0.55 + state.pointer.y * py;
        });
    });

    return (
        <group ref={ref}>
            {clouds.map((c, i) => (
                <mesh key={i} position={[c.x, c.y, c.z]} scale={c.scale}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshBasicMaterial
                        color={c.hue}
                        transparent
                        opacity={
                            isLight
                                ? theme.nebula * 0.85
                                : THREE.MathUtils.lerp(theme.nebula, theme.nebula * 1.1, viewportRef.current?.mobileBlend ?? 0)
                        }
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
}

function ParticleField({ isLight, viewportRef }: { isLight: boolean; viewportRef: ViewportRef }) {
    const theme = getSceneTheme(isLight);
    const ref = useRef<Points>(null);
    const matRef = useRef<THREE.PointsMaterial>(null);
    const isCompact = (viewportRef.current?.mobileTarget ?? 0) === 1;
    const count = isCompact ? (isLight ? 1800 : 2200) : isLight ? 1800 : 2800;

    const { positions, colors } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const c1 = new THREE.Color(theme.primary);
        const c2 = new THREE.Color(theme.accent);
        const c3 = new THREE.Color(theme.muted);
        const c4 = new THREE.Color(theme.warm);
        for (let i = 0; i < count; i++) {
            const radius = 12 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.65;
            pos[i * 3 + 2] = radius * Math.cos(phi);
            const pick = Math.random();
            const c = pick < 0.45 ? c1 : pick < 0.7 ? c2 : pick < 0.9 ? c3 : c4;
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }
        return { positions: pos, colors: col };
    }, [count, theme.primary, theme.accent, theme.muted, theme.warm]);

    useFrame((state) => {
        if (!ref.current) return;
        const t = viewportRef.current?.mobileBlend ?? 0;
        const elapsed = state.clock.elapsedTime;
        const px = THREE.MathUtils.lerp(0.18, 0.32, t);
        const py = THREE.MathUtils.lerp(0.05, 0.22, t);
        const moveX = THREE.MathUtils.lerp(0.7, 0.38, t);
        const moveY = THREE.MathUtils.lerp(0.45, 0.24, t);
        const charge = getCursorCharge();
        const { speed, vx, vy } = getCursorVelocity();
        const { nx, ny } = getCursorPointer();
        const chargeBoost = 1 + charge * 0.35;
        const speedBoost = 1 + speed * 0.25;
        const scroll = getScrollProgress();
        ref.current.rotation.y = (elapsed * 0.028 + state.pointer.x * px + nx * 0.08) * chargeBoost * speedBoost;
        ref.current.rotation.x = Math.sin(elapsed * 0.18) * 0.06 + state.pointer.y * py + scroll * 0.12 + ny * 0.04;
        ref.current.position.x = THREE.MathUtils.lerp(
            ref.current.position.x,
            state.pointer.x * moveX + nx * 0.55 + vx * 1.2,
            0.04
        );
        ref.current.position.y = THREE.MathUtils.lerp(
            ref.current.position.y,
            state.pointer.y * moveY + ny * 0.35 + vy * 0.8 - scroll * 0.65,
            0.04
        );
        if (matRef.current) {
            matRef.current.size = 0.038 + charge * 0.018 + speed * 0.028;
            matRef.current.opacity = (isLight ? theme.particle * 0.92 : theme.particle) * (1 + charge * 0.22 + speed * 0.18);
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
                ref={matRef}
                size={0.04}
                vertexColors
                transparent
                opacity={isLight ? theme.particle : theme.particle}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function BrokenStar({
    position,
    cycleOffset,
    color,
}: {
    position: Vec3;
    cycleOffset: number;
    color: string;
}) {
    const coreRef = useRef<Mesh>(null);
    const shardsRef = useRef<Group>(null);
    const shardCount = 10;
    const cycle = 9;

    useFrame((state) => {
        const phase = (state.clock.elapsedTime + cycleOffset) % cycle;
        const core = coreRef.current;
        const shards = shardsRef.current;
        if (!core || !shards) return;

        if (phase < 2.8) {
            core.visible = true;
            shards.visible = false;
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 4 + cycleOffset) * 0.12;
            core.scale.setScalar(pulse);
            return;
        }

        core.visible = phase < 3.4;
        shards.visible = true;
        const burst = Math.min(1, (phase - 2.8) / 2.2);
        const fade = Math.max(0, 1 - (phase - 5) / 4);

        shards.children.forEach((child, i) => {
            const angle = (i / shardCount) * Math.PI * 2 + cycleOffset;
            const dist = burst * (1.2 + (i % 3) * 0.35);
            child.position.set(
                Math.cos(angle) * dist,
                Math.sin(angle * 1.3) * dist * 0.55,
                Math.sin(angle) * dist * 0.45
            );
            child.rotation.z = burst * 2 + i;
            const mat = (child as Mesh).material as THREE.MeshBasicMaterial;
            mat.opacity = 0.65 * fade;
        });

        if (core.visible) {
            core.scale.setScalar(Math.max(0.2, 1 - burst * 1.4));
            (core.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - burst);
        }
    });

    return (
        <group position={position}>
            <mesh ref={coreRef}>
                <sphereGeometry args={[0.08, 12, 12]} />
                <meshBasicMaterial color={color} transparent opacity={0.9} />
            </mesh>
            <group ref={shardsRef} visible={false}>
                {Array.from({ length: shardCount }, (_, i) => (
                    <mesh key={i}>
                        <boxGeometry args={[0.06, 0.015, 0.015]} />
                        <meshBasicMaterial color={color} transparent opacity={0.65} />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

function BrokenStarField({ count }: { count: number }) {
    const stars = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                position: [
                    (Math.random() - 0.5) * 22,
                    (Math.random() - 0.5) * 14,
                    -5 - Math.random() * 10,
                ] as Vec3,
                cycleOffset: i * 1.7 + Math.random() * 2,
                color: i % 2 === 0 ? "#22d3ee" : "#fbbf24",
            })),
        [count]
    );

    return (
        <group>
            {stars.map((s, i) => (
                <BrokenStar key={i} position={s.position} cycleOffset={s.cycleOffset} color={s.color} />
            ))}
        </group>
    );
}

function ShootingStars({ count = 8 }: { count?: number }) {
    const group = useRef<Group>(null);
    const stars = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                x: (Math.random() - 0.5) * 22,
                y: 4 + Math.random() * 9,
                z: -6 - Math.random() * 10,
                len: 1.4 + Math.random() * 2.2,
                speed: 2.2 + Math.random() * 2.2,
                delay: i * 2.1 + Math.random() * 3,
            })),
        [count]
    );

    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.elapsedTime;
        group.current.children.forEach((child, i) => {
            const s = stars[i];
            const cycle = ((t + s.delay) * s.speed) % 14;
            child.visible = cycle <= 1.4;
            if (!child.visible) return;
            child.position.set(s.x - cycle * 4.5, s.y - cycle * 2.4, s.z);
        });
    });

    return (
        <group ref={group}>
            {stars.map((s, i) => (
                <mesh key={i} position={[s.x, s.y, s.z]} rotation={[0, 0, -0.58]}>
                    <boxGeometry args={[s.len, 0.014, 0.014]} />
                    <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
                </mesh>
            ))}
        </group>
    );
}

function Comets({ count = 4 }: { count?: number }) {
    const group = useRef<Group>(null);
    const comets = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                startX: 8 + Math.random() * 6,
                startY: -2 + Math.random() * 12,
                z: -7 - Math.random() * 6,
                speed: 0.35 + Math.random() * 0.25,
                delay: i * 5.5,
                tail: 2.5 + Math.random() * 2,
            })),
        [count]
    );

    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.elapsedTime;
        group.current.children.forEach((child, i) => {
            const c = comets[i];
            const progress = ((t * c.speed + c.delay) % 16) / 16;
            child.visible = progress > 0.05 && progress < 0.92;
            if (!child.visible) return;
            const x = c.startX - progress * 24;
            const y = c.startY + Math.sin(progress * Math.PI) * 3;
            child.position.set(x, y, c.z);
            child.rotation.z = -0.45;
        });
    });

    return (
        <group ref={group}>
            {comets.map((c, i) => (
                <group key={i}>
                    <mesh>
                        <sphereGeometry args={[0.07, 10, 10]} />
                        <meshBasicMaterial color="#e2e8f0" transparent opacity={0.85} />
                    </mesh>
                    <mesh position={[-c.tail * 0.5, 0, 0]}>
                        <boxGeometry args={[c.tail, 0.02, 0.02]} />
                        <meshBasicMaterial color="#94a3b8" transparent opacity={0.35} />
                    </mesh>
                    <mesh position={[-c.tail * 0.85, 0, 0]}>
                        <boxGeometry args={[c.tail * 0.5, 0.035, 0.035]} />
                        <meshBasicMaterial color="#64748b" transparent opacity={0.15} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

function Planet({
    orbitRadius,
    speed,
    size,
    color,
    offset,
    ring,
    tilt = 0.35,
}: {
    orbitRadius: number;
    speed: number;
    size: number;
    color: string;
    offset: Vec3;
    ring?: string;
    tilt?: number;
}) {
    const ref = useRef<Group>(null);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime * speed;
        ref.current.position.x = offset[0] + Math.cos(t) * orbitRadius;
        ref.current.position.z = offset[2] + Math.sin(t) * orbitRadius;
        ref.current.position.y = offset[1] + Math.sin(t * 0.6) * 0.35;
        ref.current.rotation.y = t * 1.4;
    });

    return (
        <group ref={ref}>
            <mesh rotation={[tilt, 0, 0]}>
                <sphereGeometry args={[size, 24, 24]} />
                <meshBasicMaterial color={color} transparent opacity={0.92} />
            </mesh>
            {ring && (
                <mesh rotation={[Math.PI / 2.2 + tilt, 0.2, 0]}>
                    <ringGeometry args={[size * 1.35, size * 1.85, 48]} />
                    <meshBasicMaterial color={ring} transparent opacity={0.35} side={THREE.DoubleSide} />
                </mesh>
            )}
        </group>
    );
}

function Planets({ isLight, viewportRef }: { isLight: boolean; viewportRef: ViewportRef }) {
    const isCompact = (viewportRef.current?.mobileTarget ?? 0) === 1;
    if (isLight) {
        return (
            <group>
                <Planet orbitRadius={7.5} speed={0.08} size={0.35} color="#6366f1" offset={[-2, 1.5, -12]} />
                <Planet orbitRadius={9} speed={0.05} size={0.28} color="#f97316" offset={[3, -1, -14]} ring="#cbd5e1" />
            </group>
        );
    }

    if (isCompact) {
        return (
            <group>
                <Planet orbitRadius={6.2} speed={0.11} size={0.32} color="#ef4444" offset={[-4, 2, -15]} />
                <Planet orbitRadius={8.4} speed={0.07} size={0.42} color="#f59e0b" offset={[5, -0.5, -17]} tilt={0.2} />
                <Planet orbitRadius={10.5} speed={0.05} size={0.36} color="#6366f1" offset={[-1, -2, -19]} ring="#94a3b8" />
                <Planet orbitRadius={12.8} speed={0.035} size={0.28} color="#22d3ee" offset={[6, 2.5, -21]} />
                <Planet orbitRadius={14.5} speed={0.028} size={0.24} color="#a855f7" offset={[-7, 0, -23]} />
            </group>
        );
    }

    return (
        <group>
            <Planet orbitRadius={6.2} speed={0.11} size={0.42} color="#ef4444" offset={[-4, 2, -10]} />
            <Planet orbitRadius={8.4} speed={0.07} size={0.55} color="#f59e0b" offset={[5, -0.5, -12]} tilt={0.2} />
            <Planet orbitRadius={10.5} speed={0.05} size={0.48} color="#6366f1" offset={[-1, -2, -14]} ring="#94a3b8" />
            <Planet orbitRadius={12.8} speed={0.035} size={0.38} color="#22d3ee" offset={[6, 2.5, -16]} />
            <Planet orbitRadius={14.5} speed={0.028} size={0.32} color="#a855f7" offset={[-7, 0, -18]} />
        </group>
    );
}

function AsteroidBelt({ isLight, viewportRef }: { isLight: boolean; viewportRef: ViewportRef }) {
    const theme = getSceneTheme(isLight);
    const ref = useRef<Group>(null);
    const isCompact = (viewportRef.current?.mobileTarget ?? 0) === 1;
    const count = isCompact ? (isLight ? 18 : 22) : isLight ? 18 : 32;
    const asteroids = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                angle: (i / count) * Math.PI * 2 + Math.random() * 0.4,
                radius: 11 + Math.random() * 2.5,
                y: (Math.random() - 0.5) * 1.2,
                size: 0.04 + Math.random() * 0.07,
                spin: (Math.random() - 0.5) * 2,
            })),
        [count]
    );

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = state.clock.elapsedTime * 0.018;
        ref.current.children.forEach((child, i) => {
            const a = asteroids[i];
            child.rotation.x = state.clock.elapsedTime * a.spin;
            child.rotation.z = state.clock.elapsedTime * a.spin * 0.7;
        });
    });

    return (
        <group ref={ref} position={[0, 0, -8]}>
            {asteroids.map((a, i) => (
                <mesh
                    key={i}
                    position={[Math.cos(a.angle) * a.radius, a.y, Math.sin(a.angle) * a.radius]}
                >
                    <dodecahedronGeometry args={[a.size, 0]} />
                    <meshBasicMaterial color={theme.muted} transparent opacity={isLight ? 0.38 : 0.55} wireframe />
                </mesh>
            ))}
        </group>
    );
}

function OrbitingMoon({ viewportRef }: { viewportRef: ViewportRef }) {
    const moonRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (!moonRef.current) return;
        const t = viewportRef.current?.mobileBlend ?? 0;
        const orbitRadius = THREE.MathUtils.lerp(3.8, 2.35, t);
        const size = THREE.MathUtils.lerp(0.12, 0.08, t);
        const elapsed = state.clock.elapsedTime * 0.45;
        moonRef.current.position.x = Math.cos(elapsed) * orbitRadius;
        moonRef.current.position.z = Math.sin(elapsed) * orbitRadius;
        moonRef.current.position.y = Math.sin(elapsed * 2) * 0.25;
        moonRef.current.scale.setScalar(size / 0.12);
    });

    return (
        <mesh ref={moonRef}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshBasicMaterial color="#94a3b8" transparent opacity={0.7} />
        </mesh>
    );
}

function DataStreams({ count = 14 }: { count?: number }) {
    const group = useRef<Group>(null);
    const streams = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                x: (Math.random() - 0.5) * 16,
                y: (Math.random() - 0.5) * 10,
                z: -4 - Math.random() * 5,
                len: 1.8 + Math.random() * 3.5,
                speed: 0.45 + Math.random() * 0.9,
                phase: i * 0.7,
                color: i % 3 === 0 ? "#22d3ee" : "#14b8a6",
            })),
        [count]
    );

    useFrame((state) => {
        if (!group.current) return;
        group.current.children.forEach((child, i) => {
            const s = streams[i];
            const t = (state.clock.elapsedTime * s.speed + s.phase) % 9;
            child.position.y = s.y + t * 0.55 - 2.5;
            child.position.x = s.x + Math.sin(state.clock.elapsedTime * 0.25 + i) * 0.35;
        });
    });

    return (
        <group ref={group}>
            {streams.map((s, i) => (
                <mesh key={i} position={[s.x, s.y, s.z]}>
                    <boxGeometry args={[0.01, s.len, 0.01]} />
                    <meshBasicMaterial color={s.color} transparent opacity={0.32} />
                </mesh>
            ))}
        </group>
    );
}

function WireGlobe({ isLight, viewportRef }: { isLight: boolean; viewportRef: ViewportRef }) {
    const theme = getSceneTheme(isLight);
    const outer = useRef<Mesh>(null);
    const inner = useRef<Mesh>(null);
    const ring = useRef<Mesh>(null);
    const shellRef = useRef<Group>(null);

    useFrame((state) => {
        if (!outer.current || !inner.current || !ring.current || !shellRef.current) return;
        const blend = viewportRef.current?.mobileBlend ?? 0;
        const elapsed = state.clock.elapsedTime;
        const px = THREE.MathUtils.lerp(0.22, 0.12, blend);
        const py = THREE.MathUtils.lerp(0.08, 0.05, blend);
        const { nx, ny } = getCursorPointer();
        const globeScale = THREE.MathUtils.lerp(1, MOBILE.globe.outerR / 2.55, blend) * (1 + getCursorCharge() * 0.1);

        shellRef.current.scale.setScalar(globeScale);
        outer.current.rotation.y = elapsed * 0.1 + state.pointer.x * px + nx * 0.06;
        outer.current.rotation.x = 0.32 + state.pointer.y * py + ny * 0.04;
        inner.current.rotation.y = -elapsed * 0.16;
        inner.current.rotation.z = elapsed * 0.05;
        ring.current.rotation.z = elapsed * 0.07;
        ring.current.rotation.x = Math.PI / 2.1;
    });

    return (
        <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.4}>
            <group ref={shellRef}>
                <mesh>
                    <icosahedronGeometry args={[2.48, 2]} />
                    <meshStandardMaterial
                        color={theme.primaryDark}
                        emissive={theme.primary}
                        emissiveIntensity={theme.wire.shellEmissive}
                        transparent
                        opacity={theme.wire.shell}
                        roughness={0.85}
                        metalness={0.35}
                        depthWrite={false}
                    />
                </mesh>
                <mesh ref={outer}>
                    <icosahedronGeometry args={[2.55, 4]} />
                    <meshBasicMaterial color={theme.primary} wireframe transparent opacity={theme.wire.outer} />
                </mesh>
                <mesh ref={inner}>
                    <octahedronGeometry args={[1.75, 0]} />
                    <meshBasicMaterial color={theme.accent} wireframe transparent opacity={theme.wire.inner} />
                </mesh>
                <mesh ref={ring}>
                    <torusGeometry args={[3.1, 0.015, 8, 80]} />
                    <meshBasicMaterial color={theme.primary} transparent opacity={theme.wire.ring} />
                </mesh>
                <OrbitingMoon viewportRef={viewportRef} />
            </group>
        </Float>
    );
}

function InnerCore({ isLight, viewportRef }: { isLight: boolean; viewportRef: ViewportRef }) {
    const theme = getSceneTheme(isLight);
    const groupRef = useRef<Group>(null);
    const ref = useRef<Mesh>(null);
    const glow = useRef<Mesh>(null);
    const light = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        if (!ref.current || !glow.current || !groupRef.current) return;
        const blend = viewportRef.current?.mobileBlend ?? 0;
        const elapsed = state.clock.elapsedTime;
        ref.current.rotation.y = -elapsed * 0.12;
        const pulse = (1 + Math.sin(elapsed * 1.1) * 0.07) * (1 + getCursorCharge() * 0.14);
        const baseScale = THREE.MathUtils.lerp(1, 0.7, blend);
        groupRef.current.scale.setScalar(baseScale);
        ref.current.scale.setScalar(pulse);
        glow.current.scale.setScalar(pulse * 1.8);
        if (light.current) {
            const charge = getCursorCharge();
            light.current.intensity =
                (0.5 + Math.sin(elapsed * 1.4) * 0.18 + charge * 0.35) * THREE.MathUtils.lerp(1, 0.85, blend);
        }
    });

    return (
        <group ref={groupRef}>
            <mesh ref={glow}>
                <sphereGeometry args={[0.85, 20, 20]} />
                <meshBasicMaterial color={theme.core} transparent opacity={isLight ? 0.035 : 0.05} depthWrite={false} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh ref={ref}>
                <sphereGeometry args={[0.55, 28, 28]} />
                <meshStandardMaterial
                    color={theme.core}
                    emissive={theme.coreEmissive}
                    emissiveIntensity={isLight ? 0.4 : 0.55}
                    transparent
                    opacity={isLight ? 0.22 : 0.28}
                    roughness={0.15}
                    metalness={0.75}
                />
            </mesh>
            <mesh scale={1.15}>
                <sphereGeometry args={[0.55, 16, 16]} />
                <meshBasicMaterial color={theme.coreEmissive} transparent opacity={isLight ? 0.03 : 0.04} depthWrite={false} blending={THREE.AdditiveBlending} />
            </mesh>
            <pointLight ref={light} color={theme.core} intensity={isLight ? 0.42 : 0.55} distance={12} />
        </group>
    );
}

function OrbitRing({
    radius,
    opacity,
    speed,
    color,
    viewportRef,
}: {
    radius: number;
    opacity: number;
    speed: number;
    color: string;
    viewportRef: ViewportRef;
}) {
    const ref = useRef<Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        const blend = viewportRef.current?.mobileBlend ?? 0;
        ref.current.rotation.z = state.clock.elapsedTime * speed;
        ref.current.rotation.x = Math.PI / 2.15 + state.pointer.y * THREE.MathUtils.lerp(0.1, 0.06, blend);
        ref.current.position.x = state.pointer.x * THREE.MathUtils.lerp(0.3, 0.18, blend);
    });

    return (
        <mesh ref={ref}>
            <torusGeometry args={[radius, 0.018, 10, 100]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} />
        </mesh>
    );
}

function HexRing({ count = 14, isLight }: { count?: number; isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const ref = useRef<Group>(null);
    const hexes = useMemo(() => {
        const items: { x: number; y: number; s: number }[] = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            items.push({ x: Math.cos(angle) * 5.4, y: Math.sin(angle) * 5.4, s: 0.65 + (i % 3) * 0.12 });
        }
        return items;
    }, [count]);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.z = state.clock.elapsedTime * 0.035;
    });

    return (
        <group ref={ref} position={[0, 0, -3.2]}>
            {hexes.map((h, i) => (
                <mesh key={i} position={[h.x, h.y, 0]} scale={h.s}>
                    <ringGeometry args={[0.32, 0.38, 6]} />
                    <meshBasicMaterial color={theme.primary} transparent opacity={theme.hex} wireframe />
                </mesh>
            ))}
        </group>
    );
}

function SceneGrid({ viewportRef, isLight }: { viewportRef: ViewportRef; isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const groupRef = useRef<Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        const blend = viewportRef.current?.mobileBlend ?? 0;
        const scroll = getScrollProgress();
        groupRef.current.position.x = state.pointer.x * THREE.MathUtils.lerp(0.38, 0.24, blend);
        groupRef.current.position.z = state.pointer.y * THREE.MathUtils.lerp(0.26, 0.16, blend);
        groupRef.current.position.y = THREE.MathUtils.lerp(-4.85, -5.15, blend) - scroll * 1.35;
    });

    return (
        <group ref={groupRef}>
            <Grid
                infiniteGrid
                cellSize={0.52}
                cellThickness={0.48}
                cellColor={theme.gridCell}
                sectionSize={3.1}
                sectionThickness={0.85}
                sectionColor={theme.gridSection}
                fadeDistance={32}
                fadeStrength={1.55}
                fadeFrom={0.55}
                followCamera={false}
            />
        </group>
    );
}

function CodeNodes({ count = 10, isLight }: { count?: number; isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const group = useRef<Group>(null);
    const nodes = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                x: Math.cos(i * 0.628) * 4.6,
                y: Math.sin(i * 0.82) * 2.6,
                z: Math.sin(i * 0.95) * 2.4,
                s: 0.04 + (i % 2) * 0.022,
            })),
        [count]
    );

    useFrame((state) => {
        if (!group.current) return;
        group.current.rotation.y = state.clock.elapsedTime * 0.055 + state.pointer.x * 0.035;
    });

    return (
        <group ref={group}>
            {nodes.map((n, i) => (
                <mesh key={i} position={[n.x, n.y, n.z]}>
                    <boxGeometry args={[n.s * 2.2, n.s * 2.2, n.s * 2.2]} />
                    <meshBasicMaterial color={i % 2 === 0 ? theme.primary : theme.accent} transparent opacity={isLight ? 0.28 : 0.38} wireframe />
                </mesh>
            ))}
        </group>
    );
}

function CursorReactiveSparkles({ isLight, isCompact }: { isLight: boolean; isCompact: boolean }) {
    const theme = getSceneTheme(isLight);
    const groupRef = useRef<Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        const charge = getCursorCharge();
        const { speed } = getCursorVelocity();
        const { nx, ny } = getCursorPointer();
        groupRef.current.position.set(nx * 2.2, ny * 1.4, 0.4 + charge * 0.6);
        groupRef.current.rotation.z = state.clock.elapsedTime * (0.4 + speed * 2);
        groupRef.current.visible = charge > 0.08 || speed > 0.02;
    });

    if (isCompact) return null;

    return (
        <group ref={groupRef}>
            <Sparkles
                count={isLight ? 24 : 36}
                scale={[2.8, 2.2, 1.8]}
                size={1.2}
                speed={0.6}
                opacity={isLight ? 0.35 : 0.55}
                color={theme.accentSoft}
            />
        </group>
    );
}

function ViewportFrameRelay({
    viewportRef,
    onFrame,
}: {
    viewportRef: ViewportRef;
    onFrame?: (snapshot: ViewportSnapshot) => void;
}) {
    useFrame(() => {
        if (!onFrame || !viewportRef.current) return;
        onFrame(viewportRef.current);
    });
    return null;
}

function SceneContent({ isLight, viewportRef }: { isLight: boolean; viewportRef: ViewportRef }) {
    const theme = getSceneTheme(isLight);
    const isCompact = (viewportRef.current?.mobileTarget ?? 0) === 1;

    return (
        <>
            <Stars
                radius={110}
                depth={55}
                count={isCompact ? 4000 : isLight ? 2200 : 4500}
                factor={isCompact ? 3.6 : isLight ? 3.2 : 4.2}
                saturation={isLight ? 0.02 : 0.08}
                fade
                speed={0.45}
            />
            <Sparkles
                count={isCompact ? 55 : isLight ? 80 : 140}
                scale={[16, 12, 14]}
                size={2.8}
                speed={0.35}
                opacity={isLight ? 0.22 : 0.42}
                color={theme.sparkle}
            />
            <CursorReactiveSparkles isLight={isLight} isCompact={isCompact} />
            <Sparkles
                count={isCompact ? 30 : 55}
                scale={[22, 16, 18]}
                size={1.4}
                speed={0.18}
                opacity={isLight ? 0.1 : 0.2}
                color={theme.sparkleFine}
            />
            <hemisphereLight args={[isLight ? "#e2e8f0" : theme.accent, isLight ? "#f8fafc" : theme.fog, isLight ? 0.42 : 0.38]} />
            <directionalLight position={[6, 10, 4]} intensity={isLight ? 0.32 : 0.22} color={isLight ? "#ffffff" : "#f8fafc"} />
            <ambientLight intensity={isLight ? 0.55 : isCompact ? 0.42 : 0.4} />
            <pointLight position={[8, 8, 8]} intensity={isLight ? 0.3 : isCompact ? 0.44 : 0.48} color={theme.primary} />
            <pointLight position={[-6, -4, 5]} intensity={isLight ? 0.16 : isCompact ? 0.26 : 0.28} color={theme.accent} />
            <pointLight position={[0, -6, 2]} intensity={isLight ? 0.1 : 0.15} color={theme.primaryDark} />
            <NebulaMist isLight={isLight} viewportRef={viewportRef} />
            <ParticleField isLight={isLight} viewportRef={viewportRef} />
            <BrokenStarField count={isCompact ? 7 : isLight ? 4 : 7} />
            <ShootingStars count={8} />
            <Comets count={4} />
            <Planets isLight={isLight} viewportRef={viewportRef} />
            <AsteroidBelt isLight={isLight} viewportRef={viewportRef} />
            <DataStreams count={14} />
            <SceneFocal viewportRef={viewportRef}>
                <WireGlobe isLight={isLight} viewportRef={viewportRef} />
                <InnerCore isLight={isLight} viewportRef={viewportRef} />
                <OrbitRing radius={3.3} opacity={theme.orbit[0]} speed={0.085} color={theme.primary} viewportRef={viewportRef} />
                <OrbitRing radius={4.5} opacity={theme.orbit[1]} speed={-0.055} color={theme.accent} viewportRef={viewportRef} />
                <OrbitRing radius={5.8} opacity={theme.orbit[2]} speed={0.038} color={theme.muted} viewportRef={viewportRef} />
            </SceneFocal>
            <SceneProfessional isLight={isLight} isCompact={isCompact} />
            <SceneFuturistic isLight={isLight} isCompact={isCompact} viewportRef={viewportRef} />
            <HexRing count={14} isLight={isLight} />
            <CodeNodes count={10} isLight={isLight} />
            <SceneGrid viewportRef={viewportRef} isLight={isLight} />
            <SceneInteractions isLight={isLight} />
        </>
    );
}

export function SceneCanvas({
    container,
    onViewportFrame,
}: {
    container: HTMLElement;
    onViewportFrame?: (snapshot: ViewportSnapshot) => void;
}) {
    const isLight = useIsLightTheme();
    const [isCompact, setIsCompact] = useState(false);
    const viewportRef = useViewportTracker(container, (target) => setIsCompact(target === 1));

    // Stop the render loop entirely while the tab is hidden — no visible frames
    // are lost (nothing is drawn) and it avoids burning CPU/GPU in the background
    // plus a visible "catch-up" jank burst when switching back.
    const [frameloop, setFrameloop] = useState<"always" | "never">(
        typeof document !== "undefined" && document.hidden ? "never" : "always"
    );

    useEffect(() => {
        const onVisibilityChange = () => {
            setFrameloop(document.hidden ? "never" : "always");
        };
        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => document.removeEventListener("visibilitychange", onVisibilityChange);
    }, []);

    return (
        <Canvas
            eventSource={container}
            eventPrefix="client"
            camera={{ position: DESKTOP.camera.position, fov: DESKTOP.camera.fov }}
            gl={{ alpha: true, antialias: !isCompact, powerPreference: "high-performance" }}
            style={{ width: "100%", height: "100%", background: "transparent", display: "block" }}
            dpr={isCompact ? 1 : [1, 1.4]}
            resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
            frameloop={frameloop}
        >
            <ViewportDriver viewportRef={viewportRef} />
            <ResponsiveCamera viewportRef={viewportRef} />
            <AdaptiveFog viewportRef={viewportRef} isLight={isLight} />
            <ViewportFrameRelay viewportRef={viewportRef} onFrame={onViewportFrame} />
            <SceneContent isLight={isLight} viewportRef={viewportRef} />
        </Canvas>
    );
}
