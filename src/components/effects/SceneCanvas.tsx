"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group, Mesh, Points } from "three";
import * as THREE from "three";

type Vec3 = [number, number, number];

function useIsLightTheme() {
    const { resolvedTheme } = useTheme();
    const [isLight, setIsLight] = useState(false);

    useEffect(() => {
        setIsLight(resolvedTheme === "light");
    }, [resolvedTheme]);

    return isLight;
}

function CameraRig() {
    useFrame((state) => {
        const { pointer, camera } = state;
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.15, 0.042);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.78, 0.042);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 9.4 + Math.abs(pointer.y) * 0.25, 0.028);
        camera.lookAt(pointer.x * 0.45, pointer.y * 0.3, 0);
    });
    return null;
}

function NebulaMist({ dimmed }: { dimmed: boolean }) {
    const ref = useRef<Group>(null);
    const clouds = useMemo(
        () =>
            Array.from({ length: 6 }, (_, i) => ({
                x: (Math.random() - 0.5) * 24,
                y: (Math.random() - 0.5) * 16,
                z: -8 - Math.random() * 8,
                scale: 6 + Math.random() * 9,
                speed: 0.012 + Math.random() * 0.018,
                hue: i % 3 === 0 ? "#14b8a6" : i % 3 === 1 ? "#22d3ee" : "#6366f1",
            })),
        []
    );

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.children.forEach((child, i) => {
            const c = clouds[i];
            child.position.x = c.x + Math.sin(t * c.speed + i) * 0.9 + state.pointer.x * 0.6;
            child.position.y = c.y + Math.cos(t * c.speed * 0.8 + i) * 0.55 + state.pointer.y * 0.4;
        });
    });

    return (
        <group ref={ref}>
            {clouds.map((c, i) => (
                <mesh key={i} position={[c.x, c.y, c.z]} scale={c.scale}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshBasicMaterial color={c.hue} transparent opacity={dimmed ? 0.018 : 0.038} depthWrite={false} />
                </mesh>
            ))}
        </group>
    );
}

function ParticleField({ dimmed }: { dimmed: boolean }) {
    const ref = useRef<Points>(null);
    const count = dimmed ? 1800 : 2800;

    const { positions, colors } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const c1 = new THREE.Color("#14b8a6");
        const c2 = new THREE.Color("#22d3ee");
        const c3 = new THREE.Color("#64748b");
        const c4 = new THREE.Color("#f59e0b");
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
    }, [count]);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.rotation.y = t * 0.028 + state.pointer.x * 0.18;
        ref.current.rotation.x = Math.sin(t * 0.18) * 0.06 + state.pointer.y * 0.05;
        ref.current.position.x = state.pointer.x * 0.7;
        ref.current.position.y = state.pointer.y * 0.45;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.042}
                vertexColors
                transparent
                opacity={dimmed ? 0.45 : 0.78}
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

function BrokenStarField({ dimmed }: { dimmed: boolean }) {
    const stars = useMemo(
        () =>
            Array.from({ length: dimmed ? 4 : 7 }, (_, i) => ({
                position: [
                    (Math.random() - 0.5) * 22,
                    (Math.random() - 0.5) * 14,
                    -5 - Math.random() * 10,
                ] as Vec3,
                cycleOffset: i * 1.7 + Math.random() * 2,
                color: i % 2 === 0 ? "#22d3ee" : "#fbbf24",
            })),
        [dimmed]
    );

    return (
        <group>
            {stars.map((s, i) => (
                <BrokenStar key={i} position={s.position} cycleOffset={s.cycleOffset} color={s.color} />
            ))}
        </group>
    );
}

function ShootingStars() {
    const group = useRef<Group>(null);
    const stars = useMemo(
        () =>
            Array.from({ length: 8 }, (_, i) => ({
                x: (Math.random() - 0.5) * 22,
                y: 4 + Math.random() * 9,
                z: -6 - Math.random() * 10,
                len: 1.4 + Math.random() * 2.2,
                speed: 2.2 + Math.random() * 2.2,
                delay: i * 2.1 + Math.random() * 3,
            })),
        []
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

function Comets() {
    const group = useRef<Group>(null);
    const comets = useMemo(
        () =>
            Array.from({ length: 4 }, (_, i) => ({
                startX: 8 + Math.random() * 6,
                startY: -2 + Math.random() * 12,
                z: -7 - Math.random() * 6,
                speed: 0.35 + Math.random() * 0.25,
                delay: i * 5.5,
                tail: 2.5 + Math.random() * 2,
            })),
        []
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

function Planets({ dimmed }: { dimmed: boolean }) {
    if (dimmed) {
        return (
            <group>
                <Planet orbitRadius={7.5} speed={0.08} size={0.35} color="#6366f1" offset={[-2, 1.5, -12]} />
                <Planet orbitRadius={9} speed={0.05} size={0.28} color="#f97316" offset={[3, -1, -14]} ring="#cbd5e1" />
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

function AsteroidBelt({ dimmed }: { dimmed: boolean }) {
    const ref = useRef<Group>(null);
    const count = dimmed ? 18 : 32;
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
                    <meshBasicMaterial color="#64748b" transparent opacity={0.55} wireframe />
                </mesh>
            ))}
        </group>
    );
}

function OrbitingMoon() {
    const moonRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (!moonRef.current) return;
        const t = state.clock.elapsedTime * 0.45;
        moonRef.current.position.x = Math.cos(t) * 3.8;
        moonRef.current.position.z = Math.sin(t) * 3.8;
        moonRef.current.position.y = Math.sin(t * 2) * 0.25;
    });

    return (
        <mesh ref={moonRef}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshBasicMaterial color="#94a3b8" transparent opacity={0.7} />
        </mesh>
    );
}

function DataStreams() {
    const group = useRef<Group>(null);
    const streams = useMemo(
        () =>
            Array.from({ length: 14 }, (_, i) => ({
                x: (Math.random() - 0.5) * 16,
                y: (Math.random() - 0.5) * 10,
                z: -4 - Math.random() * 5,
                len: 1.8 + Math.random() * 3.5,
                speed: 0.45 + Math.random() * 0.9,
                phase: i * 0.7,
                color: i % 3 === 0 ? "#22d3ee" : "#14b8a6",
            })),
        []
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

function WireGlobe() {
    const outer = useRef<Mesh>(null);
    const inner = useRef<Mesh>(null);
    const ring = useRef<Mesh>(null);

    useFrame((state) => {
        if (!outer.current || !inner.current || !ring.current) return;
        const t = state.clock.elapsedTime;
        outer.current.rotation.y = t * 0.1 + state.pointer.x * 0.22;
        outer.current.rotation.x = 0.32 + state.pointer.y * 0.08;
        inner.current.rotation.y = -t * 0.16;
        inner.current.rotation.z = t * 0.05;
        ring.current.rotation.z = t * 0.07;
        ring.current.rotation.x = Math.PI / 2.1;
    });

    return (
        <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.4}>
            <group>
                <mesh ref={outer}>
                    <icosahedronGeometry args={[2.55, 4]} />
                    <meshBasicMaterial color="#14b8a6" wireframe transparent opacity={0.28} />
                </mesh>
                <mesh ref={inner}>
                    <octahedronGeometry args={[1.75, 0]} />
                    <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.14} />
                </mesh>
                <mesh ref={ring}>
                    <torusGeometry args={[3.1, 0.015, 8, 80]} />
                    <meshBasicMaterial color="#14b8a6" transparent opacity={0.2} />
                </mesh>
                <OrbitingMoon />
            </group>
        </Float>
    );
}

function InnerCore() {
    const ref = useRef<Mesh>(null);
    const glow = useRef<Mesh>(null);
    const light = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        if (!ref.current || !glow.current) return;
        const t = state.clock.elapsedTime;
        ref.current.rotation.y = -t * 0.12;
        const scale = 1 + Math.sin(t * 1.1) * 0.07;
        ref.current.scale.setScalar(scale);
        glow.current.scale.setScalar(scale * 1.8);
        if (light.current) light.current.intensity = 0.5 + Math.sin(t * 1.4) * 0.18;
    });

    return (
        <group>
            <mesh ref={glow}>
                <sphereGeometry args={[0.85, 20, 20]} />
                <meshBasicMaterial color="#14b8a6" transparent opacity={0.04} />
            </mesh>
            <mesh ref={ref}>
                <sphereGeometry args={[0.55, 28, 28]} />
                <meshBasicMaterial color="#14b8a6" transparent opacity={0.16} />
            </mesh>
            <pointLight ref={light} color="#14b8a6" intensity={0.55} distance={12} />
        </group>
    );
}

function OrbitRing({ radius, opacity, speed, color }: { radius: number; opacity: number; speed: number; color: string }) {
    const ref = useRef<Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.z = state.clock.elapsedTime * speed;
        ref.current.rotation.x = Math.PI / 2.15 + state.pointer.y * 0.1;
        ref.current.position.x = state.pointer.x * 0.3;
    });

    return (
        <mesh ref={ref}>
            <torusGeometry args={[radius, 0.018, 10, 100]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} />
        </mesh>
    );
}

function HexRing() {
    const ref = useRef<Group>(null);
    const hexes = useMemo(() => {
        const items: { x: number; y: number; s: number }[] = [];
        for (let i = 0; i < 14; i++) {
            const angle = (i / 14) * Math.PI * 2;
            items.push({ x: Math.cos(angle) * 5.4, y: Math.sin(angle) * 5.4, s: 0.65 + (i % 3) * 0.12 });
        }
        return items;
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.z = state.clock.elapsedTime * 0.035;
    });

    return (
        <group ref={ref} position={[0, 0, -3.2]}>
            {hexes.map((h, i) => (
                <mesh key={i} position={[h.x, h.y, 0]} scale={h.s}>
                    <ringGeometry args={[0.32, 0.38, 6]} />
                    <meshBasicMaterial color="#14b8a6" transparent opacity={0.11} wireframe />
                </mesh>
            ))}
        </group>
    );
}

function GridPlane() {
    const ref = useRef<Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.x = -Math.PI / 2.04;
        ref.current.position.y = -4.8;
        ref.current.position.x = state.pointer.x * 0.4;
        ref.current.position.z = state.pointer.y * 0.28;
    });

    return (
        <mesh ref={ref}>
            <planeGeometry args={[48, 48, 64, 64]} />
            <meshBasicMaterial color="#0f766e" wireframe transparent opacity={0.11} />
        </mesh>
    );
}

function CodeNodes() {
    const group = useRef<Group>(null);
    const nodes = useMemo(
        () =>
            Array.from({ length: 10 }, (_, i) => ({
                x: Math.cos(i * 0.628) * 4.6,
                y: Math.sin(i * 0.82) * 2.6,
                z: Math.sin(i * 0.95) * 2.4,
                s: 0.04 + (i % 2) * 0.022,
            })),
        []
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
                    <meshBasicMaterial color={i % 2 === 0 ? "#14b8a6" : "#22d3ee"} transparent opacity={0.38} wireframe />
                </mesh>
            ))}
        </group>
    );
}

function SceneContent({ isLight }: { isLight: boolean }) {
    const fogColor = isLight ? "#eef2f7" : "#0b1220";

    return (
        <>
            <CameraRig />
            <fog attach="fog" args={[fogColor, 14, 38]} />
            <ambientLight intensity={isLight ? 0.55 : 0.4} />
            <pointLight position={[8, 8, 8]} intensity={isLight ? 0.35 : 0.48} color="#14b8a6" />
            <pointLight position={[-6, -4, 5]} intensity={isLight ? 0.2 : 0.28} color="#22d3ee" />
            <pointLight position={[0, -6, 2]} intensity={0.15} color="#0f766e" />
            <Stars
                radius={110}
                depth={55}
                count={isLight ? 2200 : 4500}
                factor={isLight ? 3.2 : 4.2}
                saturation={isLight ? 0.02 : 0.08}
                fade
                speed={0.45}
            />
            <NebulaMist dimmed={isLight} />
            <ParticleField dimmed={isLight} />
            <BrokenStarField dimmed={isLight} />
            <ShootingStars />
            <Comets />
            <Planets dimmed={isLight} />
            <AsteroidBelt dimmed={isLight} />
            <DataStreams />
            <WireGlobe />
            <InnerCore />
            <OrbitRing radius={3.3} opacity={isLight ? 0.28 : 0.42} speed={0.085} color="#14b8a6" />
            <OrbitRing radius={4.5} opacity={isLight ? 0.16 : 0.24} speed={-0.055} color="#22d3ee" />
            <OrbitRing radius={5.8} opacity={isLight ? 0.08 : 0.13} speed={0.038} color="#64748b" />
            <HexRing />
            <CodeNodes />
            <GridPlane />
        </>
    );
}

export function SceneCanvas() {
    const [eventSource, setEventSource] = useState<HTMLElement | null>(null);
    const isLight = useIsLightTheme();

    useEffect(() => {
        setEventSource(document.body);
    }, []);

    if (!eventSource) return null;

    return (
        <Canvas
            eventSource={eventSource}
            eventPrefix="client"
            camera={{ position: [0, 0, 9.4], fov: 48 }}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            style={{ background: "transparent" }}
            dpr={[1, 1.4]}
        >
            <SceneContent isLight={isLight} />
        </Canvas>
    );
}
