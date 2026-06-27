"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import * as THREE from "three";
import { getCursorCharge, getCursorPointer } from "@/lib/cursor-signals";
import { getScrollProgress } from "@/lib/scene-scroll";
import { getSceneTheme } from "@/lib/scene-theme";
import type { ViewportRef } from "./scene-viewport";

function GlobeCorona({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const ref = useRef<Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        const scroll = getScrollProgress();
        const charge = getCursorCharge();
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.75) * 0.04 + charge * 0.06;
        ref.current.scale.setScalar((3.15 + scroll * 0.2) * pulse);
        const mat = ref.current.material as THREE.MeshBasicMaterial;
        mat.opacity = (isLight ? 0.025 : 0.045) + charge * 0.015;
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial
                color={theme.primary}
                transparent
                opacity={isLight ? 0.025 : 0.045}
                side={THREE.BackSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

function DepthFilaments({ isLight, isCompact, viewportRef }: { isLight: boolean; isCompact: boolean; viewportRef: ViewportRef }) {
    const theme = getSceneTheme(isLight);
    const groupRef = useRef<Group>(null);
    const count = isCompact ? 4 : 7;

    const lines = useMemo(() => {
        const items: THREE.Line[] = [];
        for (let i = 0; i < count; i++) {
            const z = -9 - (i % 4) * 2.5;
            const spread = 5 + (i % 3) * 2;
            const y = (i - count / 2) * 0.8;
            const curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(-spread, y - 1.2, z),
                new THREE.Vector3(0, y + 2.5 + (i % 2), z - 1),
                new THREE.Vector3(spread, y - 0.6, z)
            );
            const geom = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
            const mat = new THREE.LineBasicMaterial({
                color: i % 2 === 0 ? theme.primary : theme.accent,
                transparent: true,
                opacity: isLight ? 0.06 : 0.1,
                blending: THREE.AdditiveBlending,
            });
            items.push(new THREE.Line(geom, mat));
        }
        return items;
    }, [count, theme.primary, theme.accent, isLight]);

    useFrame((state) => {
        if (!groupRef.current) return;
        const scroll = getScrollProgress();
        const { nx, ny } = getCursorPointer();
        const blend = viewportRef.current?.mobileBlend ?? 0;
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.018 + scroll * 0.15;
        groupRef.current.rotation.x = ny * 0.06 + scroll * 0.04;
        groupRef.current.position.x = nx * THREE.MathUtils.lerp(0.5, 0.28, blend);
        groupRef.current.position.y = scroll * 0.35;
    });

    return (
        <group ref={groupRef}>
            {lines.map((line, i) => (
                <primitive key={i} object={line} />
            ))}
        </group>
    );
}

function ParallaxShells({ isLight, viewportRef }: { isLight: boolean; viewportRef: ViewportRef }) {
    const theme = getSceneTheme(isLight);
    const groupRef = useRef<Group>(null);
    const shells = useMemo(
        () => [
            { r: 6.8, tilt: [0.55, 0.15, 0.1] as [number, number, number], speed: 0.012, color: theme.primary, op: isLight ? 0.04 : 0.07 },
            { r: 9.2, tilt: [-0.35, 0.4, 0.05] as [number, number, number], speed: -0.008, color: theme.accent, op: isLight ? 0.03 : 0.055 },
            { r: 11.5, tilt: [0.2, -0.25, 0.12] as [number, number, number], speed: 0.005, color: theme.arcMuted, op: isLight ? 0.025 : 0.04 },
        ],
        [theme.primary, theme.accent, theme.arcMuted, isLight]
    );

    useFrame((state) => {
        if (!groupRef.current) return;
        const scroll = getScrollProgress();
        const { nx, ny } = getCursorPointer();
        const blend = viewportRef.current?.mobileBlend ?? 0;
        groupRef.current.position.x = state.pointer.x * THREE.MathUtils.lerp(0.35, 0.2, blend) + nx * 0.15;
        groupRef.current.position.y = state.pointer.y * THREE.MathUtils.lerp(0.22, 0.12, blend) + ny * 0.1 - scroll * 0.4;
        groupRef.current.children.forEach((child, i) => {
            child.rotation.z = state.clock.elapsedTime * shells[i].speed;
        });
    });

    return (
        <group ref={groupRef} position={[0, 0, -2]}>
            {shells.map((s, i) => (
                <mesh key={i} rotation={s.tilt}>
                    <torusGeometry args={[s.r, 0.012, 8, 128]} />
                    <meshBasicMaterial
                        color={s.color}
                        transparent
                        opacity={s.op}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </group>
    );
}

function OrbitLattice({ isLight, viewportRef }: { isLight: boolean; viewportRef: ViewportRef }) {
    const theme = getSceneTheme(isLight);
    const groupRef = useRef<Group>(null);
    const nodes = useMemo(
        () =>
            Array.from({ length: 16 }, (_, i) => {
                const phi = Math.acos(1 - (2 * (i + 0.5)) / 16);
                const theta = Math.PI * (1 + Math.sqrt(5)) * i;
                const r = 4.2 + (i % 3) * 0.15;
                return {
                    x: r * Math.sin(phi) * Math.cos(theta),
                    y: r * Math.sin(phi) * Math.sin(theta),
                    z: r * Math.cos(phi),
                };
            }),
        []
    );

    const edges = useMemo(() => {
        const lines: THREE.Line[] = [];
        for (let i = 0; i < nodes.length; i++) {
            const j = (i + 3) % nodes.length;
            const a = new THREE.Vector3(nodes[i].x, nodes[i].y, nodes[i].z);
            const b = new THREE.Vector3(nodes[j].x, nodes[j].y, nodes[j].z);
            const mid = a.clone().add(b).multiplyScalar(0.55);
            mid.normalize().multiplyScalar(4.8);
            const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
            const geom = new THREE.BufferGeometry().setFromPoints(curve.getPoints(24));
            const mat = new THREE.LineBasicMaterial({
                color: theme.primary,
                transparent: true,
                opacity: isLight ? 0.05 : 0.09,
                blending: THREE.AdditiveBlending,
            });
            lines.push(new THREE.Line(geom, mat));
        }
        return lines;
    }, [nodes, theme.primary, isLight]);

    useFrame((state) => {
        if (!groupRef.current) return;
        const scroll = getScrollProgress();
        const charge = getCursorCharge();
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.04 + scroll * 0.2;
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
        groupRef.current.scale.setScalar(1 + charge * 0.04);
    });

    return (
        <group ref={groupRef}>
            {edges.map((line, i) => (
                <primitive key={i} object={line} />
            ))}
            {nodes.map((n, i) => (
                <mesh key={`n-${i}`} position={[n.x, n.y, n.z]}>
                    <sphereGeometry args={[0.025, 6, 6]} />
                    <meshBasicMaterial
                        color={i % 2 === 0 ? theme.accent : theme.primary}
                        transparent
                        opacity={isLight ? 0.35 : 0.55}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
}

function VerticalBeams({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const groupRef = useRef<Group>(null);
    const beams = useMemo(
        () =>
            Array.from({ length: 8 }, (_, i) => ({
                angle: (i / 8) * Math.PI * 2,
                r: 7.5,
                h: 14 + (i % 2) * 4,
            })),
        []
    );

    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    });

    return (
        <group ref={groupRef} position={[0, 0, -5]}>
            {beams.map((b, i) => (
                <mesh
                    key={i}
                    position={[Math.cos(b.angle) * b.r, 0, Math.sin(b.angle) * b.r]}
                    rotation={[0, -b.angle, 0.05]}
                >
                    <cylinderGeometry args={[0.008, 0.04, b.h, 6, 1, true]} />
                    <meshBasicMaterial
                        color={theme.primary}
                        transparent
                        opacity={isLight ? 0.015 : 0.028}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </group>
    );
}

/** Extra depth layers integrated with the wire globe — no duplicate CSS overlays. */
export function SceneFuturistic({
    isLight,
    isCompact,
    viewportRef,
}: {
    isLight: boolean;
    isCompact: boolean;
    viewportRef: ViewportRef;
}) {
    return (
        <>
            <GlobeCorona isLight={isLight} />
            <OrbitLattice isLight={isLight} viewportRef={viewportRef} />
            <DepthFilaments isLight={isLight} isCompact={isCompact} viewportRef={viewportRef} />
            <ParallaxShells isLight={isLight} viewportRef={viewportRef} />
            {!isCompact && <VerticalBeams isLight={isLight} />}
        </>
    );
}
