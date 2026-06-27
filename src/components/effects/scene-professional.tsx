"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import * as THREE from "three";
import { getScrollProgress } from "@/lib/scene-scroll";
import { getCursorCharge } from "@/lib/cursor-signals";
import { getSceneTheme } from "@/lib/scene-theme";

function GlobeAtmosphere({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const ref = useRef<Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.04 + getCursorCharge() * 0.08;
        ref.current.scale.setScalar(1.38 * pulse);
        const mat = ref.current.material as THREE.MeshBasicMaterial;
        mat.color.set(theme.primary);
        mat.opacity = (isLight ? 0.022 : 0.045) + getCursorCharge() * 0.02;
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[2.55, 36, 36]} />
            <meshBasicMaterial
                color={theme.primary}
                transparent
                opacity={isLight ? 0.022 : 0.04}
                side={THREE.BackSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

function OrbitArcPath({
    radius,
    y,
    color,
    speed,
    arc = Math.PI * 1.35,
    isLight,
}: {
    radius: number;
    y: number;
    color: string;
    speed: number;
    arc?: number;
    isLight: boolean;
}) {
    const lineObj = useMemo(() => {
        const points: THREE.Vector3[] = [];
        const segments = 72;
        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * arc - arc / 2;
            points.push(new THREE.Vector3(Math.cos(t) * radius, y, Math.sin(t) * radius));
        }
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: isLight ? 0.1 : 0.14,
            blending: THREE.AdditiveBlending,
        });
        return new THREE.Line(geom, mat);
    }, [radius, y, color, arc, isLight]);

    useFrame((state) => {
        lineObj.rotation.y = state.clock.elapsedTime * speed;
        const scroll = getScrollProgress();
        (lineObj.material as THREE.LineBasicMaterial).opacity = (isLight ? 0.08 : 0.1) + scroll * 0.06;
    });

    return <primitive object={lineObj} />;
}

function OrbitArcPaths({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    return (
        <group position={[0, 0, -1.2]}>
            <OrbitArcPath radius={4.2} y={0.3} color={theme.primary} speed={0.04} isLight={isLight} />
            <OrbitArcPath radius={5.6} y={-0.4} color={theme.accent} speed={-0.028} arc={Math.PI * 1.1} isLight={isLight} />
            <OrbitArcPath radius={7.2} y={0.8} color={theme.arcMuted} speed={0.018} arc={Math.PI * 0.95} isLight={isLight} />
        </group>
    );
}

function VolumetricBeams({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const groupRef = useRef<Group>(null);
    const beams = useMemo(
        () =>
            Array.from({ length: 6 }, (_, i) => ({
                x: Math.cos((i / 6) * Math.PI * 2) * 5.5,
                z: Math.sin((i / 6) * Math.PI * 2) * 5.5,
                h: 6 + (i % 2) * 2,
                tilt: 0.12 + (i % 3) * 0.06,
            })),
        []
    );

    useFrame((state) => {
        if (!groupRef.current) return;
        const scroll = getScrollProgress();
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.012 + scroll * 0.25;
    });

    return (
        <group ref={groupRef} position={[0, 1.5, -6]}>
            {beams.map((b, i) => (
                <mesh key={i} position={[b.x, b.h * 0.5 - 2, b.z]} rotation={[b.tilt, (i / 6) * Math.PI * 2, 0]}>
                    <cylinderGeometry args={[0.015, 0.09, b.h, 8, 1, true]} />
                    <meshBasicMaterial
                        color={theme.primary}
                        transparent
                        opacity={isLight ? 0.018 : 0.038}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </group>
    );
}

function HoloPanels({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const groupRef = useRef<Group>(null);
    const panels = useMemo(
        () =>
            Array.from({ length: 5 }, (_, i) => ({
                x: Math.cos(i * 1.22) * 6.2,
                y: (i - 2) * 1.1,
                z: -4 - i * 0.8,
                w: 1.4 + (i % 2) * 0.4,
                h: 0.9 + (i % 3) * 0.2,
                rx: 0.1 + i * 0.08,
                ry: i * 0.35,
            })),
        []
    );

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        const scroll = getScrollProgress();
        groupRef.current.rotation.y = t * 0.018 + scroll * 0.18;
        groupRef.current.children.forEach((child, i) => {
            child.position.y = panels[i].y + Math.sin(t * 0.5 + i) * 0.18;
            child.rotation.z = Math.sin(t * 0.35 + i * 0.7) * 0.06;
        });
    });

    return (
        <group ref={groupRef}>
            {panels.map((p, i) => (
                <group key={i} position={[p.x, p.y, p.z]} rotation={[p.rx, p.ry, 0]}>
                    <mesh>
                        <planeGeometry args={[p.w, p.h]} />
                        <meshBasicMaterial
                            color={theme.primary}
                            transparent
                            opacity={isLight ? 0.03 : 0.055}
                            side={THREE.DoubleSide}
                            depthWrite={false}
                        />
                    </mesh>
                    <mesh position={[0, 0, 0.002]}>
                        <planeGeometry args={[p.w, p.h]} />
                        <meshBasicMaterial color={theme.accent} wireframe transparent opacity={isLight ? 0.12 : 0.16} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

function OrbitalNodes({ count, isLight }: { count: number; isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const groupRef = useRef<Group>(null);
    const nodes = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                angle: (i / count) * Math.PI * 2,
                radius: 4.8 + (i % 3) * 0.6,
                y: Math.sin(i * 1.4) * 0.5,
                speed: 0.08 + (i % 4) * 0.015,
                size: 0.045 + (i % 2) * 0.02,
            })),
        [count]
    );

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        groupRef.current.children.forEach((child, i) => {
            const n = nodes[i];
            const a = n.angle + t * n.speed;
            child.position.set(Math.cos(a) * n.radius, n.y + Math.sin(t + i) * 0.12, Math.sin(a) * n.radius);
            child.rotation.y = t * 2;
        });
    });

    return (
        <group ref={groupRef}>
            {nodes.map((n, i) => (
                <mesh key={i}>
                    <octahedronGeometry args={[n.size, 0]} />
                    <meshBasicMaterial
                        color={i % 2 === 0 ? theme.primary : theme.accent}
                        transparent
                        opacity={isLight ? 0.42 : 0.55}
                    />
                </mesh>
            ))}
        </group>
    );
}

function RadarSweep({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const ref = useRef<Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.z = state.clock.elapsedTime * 0.45;
        const mat = ref.current.material as THREE.MeshBasicMaterial;
        mat.opacity = (isLight ? 0.035 : 0.07) + Math.sin(state.clock.elapsedTime * 2) * 0.015;
    });

    return (
        <mesh ref={ref} position={[0, -5.2, -2]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 9, 64, 1, 0, Math.PI / 2.8]} />
            <meshBasicMaterial
                color={theme.primary}
                transparent
                opacity={isLight ? 0.04 : 0.06}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

function FloatingDiamonds({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const groupRef = useRef<Group>(null);
    const items = useMemo(
        () =>
            Array.from({ length: 8 }, (_, i) => ({
                x: (Math.random() - 0.5) * 14,
                y: (Math.random() - 0.5) * 8,
                z: -6 - Math.random() * 8,
                s: 0.06 + Math.random() * 0.05,
                speed: 0.4 + Math.random() * 0.3,
            })),
        []
    );

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        groupRef.current.children.forEach((child, i) => {
            child.rotation.x = t * items[i].speed;
            child.rotation.y = t * items[i].speed * 0.7;
            child.position.y = items[i].y + Math.sin(t * 0.6 + i) * 0.35;
        });
    });

    return (
        <group ref={groupRef}>
            {items.map((item, i) => (
                <mesh key={i} position={[item.x, item.y, item.z]}>
                    <octahedronGeometry args={[item.s, 0]} />
                    <meshBasicMaterial
                        color={isLight ? theme.muted : i % 2 === 0 ? theme.muted : theme.primary}
                        wireframe
                        transparent
                        opacity={isLight ? 0.16 : 0.22}
                    />
                </mesh>
            ))}
        </group>
    );
}

function CoreLightHalo({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const ref = useRef<Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.3) * 0.08;
        ref.current.scale.setScalar(pulse);
        ref.current.rotation.z = state.clock.elapsedTime * 0.08;
    });

    return (
        <mesh ref={ref} position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.8, 3.15, 80]} />
            <meshBasicMaterial
                color={theme.primary}
                transparent
                opacity={isLight ? 0.05 : 0.1}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

export function SceneProfessional({ isLight, isCompact }: { isLight: boolean; isCompact: boolean }) {
    return (
        <>
            <GlobeAtmosphere isLight={isLight} />
            <CoreLightHalo isLight={isLight} />
            <OrbitalNodes count={isCompact ? 5 : 10} isLight={isLight} />
            {!isCompact && (
                <>
                    <OrbitArcPaths isLight={isLight} />
                    <VolumetricBeams isLight={isLight} />
                    <HoloPanels isLight={isLight} />
                    <RadarSweep isLight={isLight} />
                    <FloatingDiamonds isLight={isLight} />
                </>
            )}
        </>
    );
}
