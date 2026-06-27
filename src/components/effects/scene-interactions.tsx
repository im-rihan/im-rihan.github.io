"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import type { Group, Mesh, PointLight, Points } from "three";
import * as THREE from "three";
import {
    getCursorCharge,
    getCursorIdle,
    getCursorPointer,
    getCursorVelocity,
    isCursorDragging,
    subscribeCursorSignals,
} from "@/lib/cursor-signals";
import { getScrollProgress } from "@/lib/scene-scroll";
import { getSceneTheme } from "@/lib/scene-theme";

function ndcToWorld(nx: number, ny: number, camera: THREE.Camera, depth = 4.5): THREE.Vector3 {
    const v = new THREE.Vector3(nx, ny, 0.5);
    v.unproject(camera);
    const dir = v.sub(camera.position).normalize();
    return camera.position.clone().add(dir.multiplyScalar(depth));
}

function PointerFollowLight() {
    const lightRef = useRef<PointLight>(null);
    const accentRef = useRef<PointLight>(null);
    const target = useRef(new THREE.Vector3());

    useFrame((state) => {
        const charge = getCursorCharge();
        const { nx, ny } = getCursorPointer();
        const { speed } = getCursorVelocity();
        const mixX = THREE.MathUtils.lerp(state.pointer.x, nx, 0.35);
        const mixY = THREE.MathUtils.lerp(state.pointer.y, ny, 0.35);
        target.current.set(mixX * 3.2, mixY * 2.2, 2.4);

        if (lightRef.current) {
            lightRef.current.position.lerp(target.current, 0.12);
            lightRef.current.intensity = THREE.MathUtils.lerp(
                lightRef.current.intensity,
                0.26 + speed * 0.1 + charge * 0.22,
                0.08
            );
        }
        if (accentRef.current) {
            accentRef.current.position.lerp(
                new THREE.Vector3(mixX * 2.4, mixY * 1.6, 1.1 + charge),
                0.1
            );
            accentRef.current.intensity = THREE.MathUtils.lerp(
                accentRef.current.intensity,
                0.12 + charge * 0.4 + speed * 0.08,
                0.1
            );
        }
    });

    return (
        <>
            <pointLight ref={lightRef} color="#22d3ee" intensity={0.28} distance={18} decay={2} />
            <pointLight ref={accentRef} color="#f59e0b" intensity={0.12} distance={14} decay={2} />
            <pointLight
                position={[0, 0, 1]}
                color="#14b8a6"
                intensity={0.08}
                distance={12}
                decay={2}
            />
        </>
    );
}

function ClickShockwaves() {
    const { camera } = useThree();
    const poolRef = useRef(
        Array.from({ length: 8 }, () => ({
            active: false,
            age: 0,
            power: 0.4,
            nx: 0,
            ny: 0,
            mesh: null as Mesh | null,
        }))
    );
    const meteorPool = useRef(
        Array.from({ length: 12 }, () => ({
            active: false,
            age: 0,
            power: 0.5,
            nx: 0,
            ny: 0,
            mesh: null as Mesh | null,
        }))
    );

    useEffect(() => subscribeCursorSignals((bursts) => {
        if (!bursts.length) return;
        bursts.forEach((burst) => {
            const slot = poolRef.current.find((p) => !p.active) ?? poolRef.current[0];
            slot.active = true;
            slot.age = 0;
            slot.power = burst.power;
            slot.nx = burst.nx;
            slot.ny = burst.ny;

            if (burst.power >= 0.88) {
                for (let i = 0; i < 3; i++) {
                    const m = meteorPool.current.find((p) => !p.active);
                    if (!m) break;
                    m.active = true;
                    m.age = i * 0.08;
                    m.power = burst.power;
                    m.nx = burst.nx + (Math.random() - 0.5) * 0.35;
                    m.ny = burst.ny + (Math.random() - 0.5) * 0.35;
                }
            }
        });
    }), []);

    useFrame((_, delta) => {
        poolRef.current.forEach((slot) => {
            if (!slot.active || !slot.mesh) return;
            slot.age += delta;
            if (slot.age >= 1.35) {
                slot.active = false;
                slot.mesh.visible = false;
                return;
            }

            const pos = ndcToWorld(slot.nx, slot.ny, camera, 3.8 + slot.power * 1.2);
            const scale = 0.15 + slot.age * (2.4 + slot.power * 1.8);
            const opacity = Math.max(0, (1 - slot.age / 1.2) * (0.35 + slot.power * 0.35));

            slot.mesh.visible = true;
            slot.mesh.position.copy(pos);
            slot.mesh.rotation.x = Math.PI / 2;
            slot.mesh.scale.setScalar(scale);
            const mat = slot.mesh.material as THREE.MeshBasicMaterial;
            mat.opacity = opacity;
            mat.color.set(slot.power > 0.65 ? "#f59e0b" : "#14b8a6");
        });

        meteorPool.current.forEach((slot) => {
            if (!slot.active || !slot.mesh) return;
            slot.age += delta;
            if (slot.age >= 1.1) {
                slot.active = false;
                slot.mesh.visible = false;
                return;
            }

            const base = ndcToWorld(slot.nx, slot.ny, camera, 5.5);
            slot.mesh.visible = true;
            slot.mesh.position.set(
                base.x + slot.age * 2.8,
                base.y + slot.age * 1.4,
                base.z - slot.age * 3.2
            );
            slot.mesh.rotation.z = Math.atan2(1.4, -3.2);
            slot.mesh.scale.set(0.04 + slot.power * 0.03, 0.04 + slot.power * 0.03, 0.8 + slot.age * 2.2);
            const mat = slot.mesh.material as THREE.MeshBasicMaterial;
            mat.opacity = Math.max(0, (1 - slot.age) * 0.7);
        });
    });

    return (
        <>
            {poolRef.current.map((slot, i) => (
                <mesh
                    key={`wave-${i}`}
                    ref={(el) => {
                        slot.mesh = el;
                        if (el) el.visible = false;
                    }}
                >
                    <ringGeometry args={[0.72, 1, 48]} />
                    <meshBasicMaterial
                        color="#14b8a6"
                        transparent
                        opacity={0}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
            {meteorPool.current.map((slot, i) => (
                <mesh
                    key={`meteor-${i}`}
                    ref={(el) => {
                        slot.mesh = el;
                        if (el) el.visible = false;
                    }}
                >
                    <boxGeometry args={[1, 1, 1]} />
                    <meshBasicMaterial
                        color="#f59e0b"
                        transparent
                        opacity={0}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </>
    );
}

function CursorSparkTrail() {
    const ref = useRef<Points>(null);
    const matRef = useRef<THREE.PointsMaterial>(null);
    const count = 64;
    const positions = useMemo(() => new Float32Array(count * 3), []);
    const history = useRef<{ x: number; y: number; z: number }[]>(
        Array.from({ length: count }, () => ({ x: 0, y: 0, z: 0 }))
    );

    useFrame((state) => {
        if (!ref.current) return;
        const charge = getCursorCharge();
        const { nx, ny } = getCursorPointer();
        const { speed } = getCursorVelocity();
        const px = THREE.MathUtils.lerp(state.pointer.x, nx, 0.4);
        const py = THREE.MathUtils.lerp(state.pointer.y, ny, 0.4);
        const head = {
            x: px * 4.2,
            y: py * 2.8,
            z: 1.2 + charge * 0.8 + speed * 0.15,
        };

        history.current.pop();
        history.current.unshift(head);

        history.current.forEach((p, i) => {
            positions[i * 3] = p.x;
            positions[i * 3 + 1] = p.y;
            positions[i * 3 + 2] = p.z;
        });

        const attr = ref.current.geometry.getAttribute("position") as THREE.BufferAttribute;
        attr.needsUpdate = true;

        if (matRef.current) {
            matRef.current.size = 0.045 + speed * 0.025 + charge * 0.02;
            matRef.current.opacity = THREE.MathUtils.clamp(0.35 + speed * 0.35 + charge * 0.25, 0.35, 0.92);
            matRef.current.color.set(charge > 0.45 ? "#f59e0b" : "#22d3ee");
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                ref={matRef}
                size={0.055}
                color="#22d3ee"
                transparent
                opacity={0.55}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function AuroraRibbons({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const ribbons = useRef<(Mesh | null)[]>([]);
    const configs = useMemo(
        () =>
            Array.from({ length: 5 }, (_, i) => ({
                y: -2 + i * 1.1,
                z: -5.5 - i * 2.2,
                hue: theme.ribbon[i],
                speed: 0.14 + i * 0.05,
                amp: 0.3 + i * 0.1,
            })),
        [theme.ribbon]
    );

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const charge = getCursorCharge();
        ribbons.current.forEach((mesh, i) => {
            if (!mesh) return;
            const c = configs[i];
            mesh.position.x = Math.sin(t * c.speed + i) * 2.4 + state.pointer.x * (0.7 + charge * 0.4);
            mesh.position.y = c.y + Math.cos(t * c.speed * 0.7 + i) * c.amp + state.pointer.y * 0.35;
            mesh.rotation.z = Math.sin(t * 0.15 + i) * 0.22 + state.pointer.x * 0.1;
            mesh.rotation.y = t * 0.035 + i * 0.28;
            const mat = mesh.material as THREE.MeshBasicMaterial;
            mat.opacity = (isLight ? 0.022 : 0.04) + charge * 0.02;
        });
    });

    return (
        <>
            {configs.map((c, i) => (
                <mesh
                    key={i}
                    ref={(el) => {
                        ribbons.current[i] = el;
                    }}
                    position={[0, c.y, c.z]}
                    scale={[9, 2.4, 1]}
                >
                    <planeGeometry args={[1, 1, 1, 1]} />
                    <meshBasicMaterial
                        color={c.hue}
                        transparent
                        opacity={isLight ? 0.022 : 0.04}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </>
    );
}

function OrbitingMotes({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const group = useRef<Group>(null);
    const motes = useMemo(
        () =>
            Array.from({ length: 10 }, (_, i) => ({
                radius: 1.5 + (i % 4) * 0.38,
                speed: 0.55 + i * 0.09,
                offset: (i / 10) * Math.PI * 2,
                y: (i % 2 === 0 ? 1 : -1) * 0.32,
            })),
        []
    );

    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.elapsedTime;
        const charge = getCursorCharge();
        const { nx, ny } = getCursorPointer();
        const px = THREE.MathUtils.lerp(state.pointer.x, nx, 0.45);
        const py = THREE.MathUtils.lerp(state.pointer.y, ny, 0.45);
        group.current.position.set(px * 2.8, py * 1.8, 0.6 + charge * 0.5);
        group.current.children.forEach((child, i) => {
            const m = motes[i];
            const a = t * m.speed + m.offset;
            child.position.set(Math.cos(a) * m.radius, m.y + Math.sin(t + i) * 0.15, Math.sin(a) * m.radius * 0.5);
            child.scale.setScalar(0.65 + charge * 0.4);
        });
    });

    return (
        <group ref={group}>
            {motes.map((_, i) => (
                <mesh key={i}>
                    <sphereGeometry args={[0.04, 8, 8]} />
                    <meshBasicMaterial
                        color={i % 3 === 0 ? theme.primary : i % 3 === 1 ? theme.warm : theme.accent}
                        transparent
                        opacity={isLight ? 0.48 : 0.62}
                    />
                </mesh>
            ))}
        </group>
    );
}

function CursorGravityDust() {
    const ref = useRef<Points>(null);
    const matRef = useRef<THREE.PointsMaterial>(null);
    const count = 120;
    const velocities = useRef<Float32Array>(new Float32Array(count * 3));

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 14;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
            velocities.current[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities.current[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        const charge = getCursorCharge();
        const { nx, ny } = getCursorPointer();
        const target = new THREE.Vector3(nx * 4.5, ny * 3, 0.8);
        const drag = isCursorDragging();
        const pull = 0.002 + charge * 0.004 + (drag ? 0.006 : 0);

        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const px = positions[ix];
            const py = positions[ix + 1];
            const pz = positions[ix + 2];

            velocities.current[ix] += (target.x - px) * pull;
            velocities.current[ix + 1] += (target.y - py) * pull;
            velocities.current[ix + 2] += (target.z - pz) * pull * 0.5;

            velocities.current[ix] *= 0.96;
            velocities.current[ix + 1] *= 0.96;
            velocities.current[ix + 2] *= 0.96;

            positions[ix] = px + velocities.current[ix];
            positions[ix + 1] = py + velocities.current[ix + 1];
            positions[ix + 2] = pz + velocities.current[ix + 2];

            if (Math.hypot(px - target.x, py - target.y) > 12) {
                positions[ix] = target.x + (Math.random() - 0.5) * 10;
                positions[ix + 1] = target.y + (Math.random() - 0.5) * 8;
                positions[ix + 2] = target.z + (Math.random() - 0.5) * 6;
            }
        }

        const attr = ref.current.geometry.getAttribute("position") as THREE.BufferAttribute;
        attr.needsUpdate = true;

        if (matRef.current) {
            const charge = getCursorCharge();
            const { speed } = getCursorVelocity();
            matRef.current.size = 0.028 + charge * 0.022 + speed * 0.018;
            matRef.current.opacity = THREE.MathUtils.clamp(0.35 + charge * 0.35 + speed * 0.25, 0.35, 0.88);
            matRef.current.color.set(charge > 0.45 ? "#f59e0b" : "#14b8a6");
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                ref={matRef}
                size={0.032}
                color="#14b8a6"
                transparent
                opacity={0.45}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function ConstellationWeb() {
    const anchors = useMemo(
        () =>
            Array.from({ length: 8 }, (_, i) => {
                const a = (i / 8) * Math.PI * 2;
                return new THREE.Vector3(Math.cos(a) * 5.5, Math.sin(a * 1.3) * 2.8, Math.sin(a) * 3.2);
            }),
        []
    );
    const cursorWorld = useRef(new THREE.Vector3());
    const { camera } = useThree();

    useFrame((state) => {
        const { nx, ny } = getCursorPointer();
        const { speed } = getCursorVelocity();
        const depth = 2.5 + speed * 0.8;
        cursorWorld.current.copy(ndcToWorld(nx, ny, camera, depth));
    });

    return (
        <group>
            {anchors.map((anchor, i) => (
                <ConstellationLine key={i} from={anchor} toRef={cursorWorld} index={i} />
            ))}
        </group>
    );
}

function ConstellationLine({
    from,
    toRef,
    index,
}: {
    from: THREE.Vector3;
    toRef: RefObject<THREE.Vector3 | null>;
    index: number;
}) {
    const lineObj = useMemo(() => {
        const geom = new THREE.BufferGeometry().setFromPoints([from.clone(), from.clone()]);
        const mat = new THREE.LineBasicMaterial({
            color: "#22d3ee",
            transparent: true,
            opacity: 0.08,
            blending: THREE.AdditiveBlending,
        });
        return new THREE.Line(geom, mat);
    }, [from]);

    useFrame((state) => {
        if (!toRef.current) return;
        const { speed } = getCursorVelocity();
        const charge = getCursorCharge();
        if (charge > 0.12) {
            (lineObj.material as THREE.LineBasicMaterial).opacity = 0;
            return;
        }
        const opacity = THREE.MathUtils.clamp(speed * 0.14, 0, 0.14);
        if (opacity < 0.02) {
            (lineObj.material as THREE.LineBasicMaterial).opacity = 0;
            return;
        }
        const wobble = Math.sin(state.clock.elapsedTime * 1.2 + index) * 0.05;

        const end = toRef.current.clone();
        end.x += wobble;
        end.y += wobble * 0.5;
        lineObj.geometry.setFromPoints([from, end]);
        (lineObj.material as THREE.LineBasicMaterial).opacity = opacity;
    });

    return <primitive object={lineObj} />;
}

function ChargeGlobeAura({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const ringRef = useRef<Mesh>(null);
    const ring2Ref = useRef<Mesh>(null);

    useFrame((state) => {
        const charge = getCursorCharge();
        const idle = getCursorIdle();
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.04;

        if (ringRef.current) {
            const scale = (2.8 + charge * 0.9) * pulse;
            ringRef.current.scale.setScalar(scale);
            ringRef.current.rotation.z = state.clock.elapsedTime * 0.12;
            ringRef.current.rotation.x = Math.PI / 2.05;
            const mat = ringRef.current.material as THREE.MeshBasicMaterial;
            mat.opacity = 0.05 + charge * 0.1;
        }
        if (ring2Ref.current) {
            const scale = (3.6 + charge * 1.2) * pulse;
            ring2Ref.current.scale.setScalar(scale);
            ring2Ref.current.rotation.z = -state.clock.elapsedTime * 0.08;
            ring2Ref.current.rotation.x = Math.PI / 2.1;
            const mat = ring2Ref.current.material as THREE.MeshBasicMaterial;
            mat.opacity = 0.03 + charge * 0.06 + (idle > 2000 ? 0.04 : 0);
        }
    });

    return (
        <group>
            <mesh ref={ringRef}>
                <torusGeometry args={[1, 0.012, 8, 96]} />
                <meshBasicMaterial color={theme.primary} transparent opacity={isLight ? 0.06 : 0.08} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh ref={ring2Ref}>
                <torusGeometry args={[1, 0.008, 8, 96]} />
                <meshBasicMaterial color={theme.warm} transparent opacity={isLight ? 0.04 : 0.05} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
}

function EnergyTether({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const end = useRef(new THREE.Vector3());
    const { camera } = useThree();
    const lineObj = useMemo(() => {
        const geom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 1),
        ]);
        const mat = new THREE.LineBasicMaterial({
            color: theme.primary,
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending,
        });
        return new THREE.Line(geom, mat);
    }, [theme.primary]);

    useFrame((state) => {
        const charge = getCursorCharge();
        const { nx, ny } = getCursorPointer();
        const { speed } = getCursorVelocity();
        if (charge > 0.15 || isCursorDragging()) {
            (lineObj.material as THREE.LineBasicMaterial).opacity = 0;
            return;
        }
        end.current.copy(ndcToWorld(nx, ny, camera, 2.8));
        end.current.x += Math.sin(state.clock.elapsedTime * 3) * 0.04 * speed;
        lineObj.geometry.setFromPoints([new THREE.Vector3(0, 0, 0), end.current]);
        (lineObj.material as THREE.LineBasicMaterial).opacity = THREE.MathUtils.clamp(
            speed * 0.1,
            0,
            0.16
        );
    });

    return <primitive object={lineObj} />;
}

function FloatingGlyphs({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const group = useRef<Group>(null);
    const glyphs = useMemo(
        () =>
            ["tetrahedron", "octahedron", "icosahedron"].flatMap((shape, si) =>
                Array.from({ length: 3 }, (_, i) => ({
                    shape,
                    x: (si - 1) * 4.2 + (i - 1) * 1.8,
                    y: (i - 1) * 1.4,
                    z: -3 - si * 2 - i,
                    speed: 0.3 + si * 0.1 + i * 0.05,
                }))
            ),
        []
    );

    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.elapsedTime;
        const scroll = getScrollProgress();
        group.current.rotation.y = t * 0.02 + state.pointer.x * 0.08 + scroll * 0.35;
        group.current.position.y = scroll * 0.5;
        group.current.children.forEach((child, i) => {
            child.rotation.x = t * glyphs[i].speed;
            child.rotation.z = t * glyphs[i].speed * 0.7;
            child.position.y = glyphs[i].y + Math.sin(t + i) * 0.25;
        });
    });

    return (
        <group ref={group}>
            {glyphs.map((g, i) => (
                <mesh key={i} position={[g.x, g.y, g.z]} scale={0.22}>
                    {g.shape === "tetrahedron" && <tetrahedronGeometry args={[1, 0]} />}
                    {g.shape === "octahedron" && <octahedronGeometry args={[1, 0]} />}
                    {g.shape === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
                    <meshBasicMaterial
                        color={i % 2 === 0 ? theme.accent : theme.primary}
                        wireframe
                        transparent
                        opacity={isLight ? 0.12 : 0.18}
                    />
                </mesh>
            ))}
        </group>
    );
}

function HoloScanSweep({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const ref = useRef<Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        const idle = getCursorIdle();
        const scroll = getScrollProgress();
        ref.current.rotation.y = state.clock.elapsedTime * 0.35 + scroll * Math.PI * 0.5;
        ref.current.rotation.x = Math.PI / 2;
        ref.current.position.y = scroll * 0.8 - 0.4;
        const mat = ref.current.material as THREE.MeshBasicMaterial;
        mat.opacity = (isLight ? 0.018 : 0.025) + (idle > 1500 ? (isLight ? 0.025 : 0.035) : 0) + scroll * 0.02;
    });

    return (
        <mesh ref={ref} scale={7}>
            <ringGeometry args={[0.92, 1, 64]} />
            <meshBasicMaterial color={theme.accent} transparent opacity={isLight ? 0.03 : 0.04} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
    );
}

function BurstBeacon() {
    const { camera } = useThree();
    const poolRef = useRef(
        Array.from({ length: 6 }, () => ({
            active: false,
            age: 0,
            power: 0.4,
            nx: 0,
            ny: 0,
            mesh: null as Mesh | null,
        }))
    );

    useEffect(() => subscribeCursorSignals((bursts) => {
        bursts.forEach((burst) => {
            const slot = poolRef.current.find((p) => !p.active) ?? poolRef.current[0];
            slot.active = true;
            slot.age = 0;
            slot.power = burst.power;
            slot.nx = burst.nx;
            slot.ny = burst.ny;
        });
    }), []);

    useFrame((_, delta) => {
        poolRef.current.forEach((slot) => {
            if (!slot.active || !slot.mesh) return;
            slot.age += delta;
            if (slot.age >= 0.95) {
                slot.active = false;
                slot.mesh.visible = false;
                return;
            }
            const pos = ndcToWorld(slot.nx, slot.ny, camera, 3.2 + slot.power * 0.8);
            slot.mesh.visible = true;
            slot.mesh.position.copy(pos);
            slot.mesh.scale.setScalar(0.08 + slot.age * (0.32 + slot.power * 0.35));
            const mat = slot.mesh.material as THREE.MeshBasicMaterial;
            mat.opacity = Math.max(0, (1 - slot.age / 0.85) * (0.22 + slot.power * 0.18));
            mat.color.set(slot.power > 0.6 ? "#f59e0b" : "#22d3ee");
        });
    });

    return (
        <>
            {poolRef.current.map((slot, i) => (
                <mesh
                    key={`beacon-${i}`}
                    ref={(el) => {
                        slot.mesh = el;
                        if (el) el.visible = false;
                    }}
                >
                    <sphereGeometry args={[1, 14, 14]} />
                    <meshBasicMaterial color="#22d3ee" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
                </mesh>
            ))}
        </>
    );
}

function CrystalShards({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const group = useRef<Group>(null);
    const shards = useMemo(
        () =>
            Array.from({ length: 14 }, (_, i) => ({
                x: (Math.random() - 0.5) * 10,
                y: (Math.random() - 0.5) * 7,
                z: -2 - Math.random() * 6,
                phase: i * 0.7,
            })),
        []
    );

    useFrame((state) => {
        if (!group.current) return;
        const { nx, ny, speed } = { ...getCursorPointer(), ...getCursorVelocity() };
        const target = new THREE.Vector3(nx * 3.5, ny * 2.4, 0.5);
        const pull = THREE.MathUtils.clamp(speed * 0.8, 0, 0.35);

        group.current.children.forEach((child, i) => {
            const s = shards[i];
            const home = new THREE.Vector3(s.x, s.y + Math.sin(state.clock.elapsedTime + s.phase) * 0.2, s.z);
            child.position.lerp(
                home.clone().lerp(target, pull),
                0.04 + pull * 0.06
            );
            child.rotation.x = state.clock.elapsedTime * 0.4 + i;
            child.rotation.y = state.clock.elapsedTime * 0.25 + i * 0.3;
        });
    });

    return (
        <group ref={group}>
            {shards.map((_, i) => (
                <mesh key={i} scale={0.12}>
                    <octahedronGeometry args={[1, 0]} />
                    <meshBasicMaterial
                        color={i % 2 === 0 ? theme.primary : theme.purple}
                        wireframe
                        transparent
                        opacity={isLight ? 0.16 : 0.22}
                    />
                </mesh>
            ))}
        </group>
    );
}

function AmbientPulseOrbs({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const orbs = useRef<(Mesh | null)[]>([]);
    const configs = useMemo(
        () =>
            theme.orb.map((hue, i) => ({
                x: [-5, 4.5, 0][i],
                y: [2, -1.5, 3][i],
                z: [-8, -11, -14][i],
                hue,
                speed: [0.5, 0.38, 0.42][i],
            })),
        [theme.orb]
    );

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const { speed } = getCursorVelocity();
        const scroll = getScrollProgress();
        orbs.current.forEach((mesh, i) => {
            if (!mesh) return;
            const c = configs[i];
            const pulse = 1 + Math.sin(t * c.speed + i) * 0.12;
            mesh.scale.setScalar((2.2 + i * 0.4) * pulse * (1 + scroll * 0.08));
            mesh.position.y = c.y + Math.sin(t * 0.3 + i) * 0.5 + state.pointer.y * 0.2 + scroll * 0.6;
            mesh.position.z = c.z - scroll * 2.2;
            const mat = mesh.material as THREE.MeshBasicMaterial;
            mat.opacity = (isLight ? 0.018 : 0.032) + speed * 0.04;
        });
    });

    return (
        <>
            {configs.map((c, i) => (
                <mesh
                    key={i}
                    ref={(el) => {
                        orbs.current[i] = el;
                    }}
                    position={[c.x, c.y, c.z]}
                >
                    <sphereGeometry args={[1, 20, 20]} />
                    <meshBasicMaterial color={c.hue} transparent opacity={0.03} depthWrite={false} />
                </mesh>
            ))}
        </>
    );
}

function TwinkleDeepStars({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const ref = useRef<Points>(null);
    const matRef = useRef<THREE.PointsMaterial>(null);
    const count = 600;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 40;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 28;
            pos[i * 3 + 2] = -15 - Math.random() * 25;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        const { nx, ny } = getCursorPointer();
        ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, nx * 1.2, 0.04);
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, ny * 0.8, 0.04);
        ref.current.rotation.z = state.clock.elapsedTime * 0.008;
        if (matRef.current) {
            matRef.current.opacity = 0.28 + Math.sin(state.clock.elapsedTime * 1.6) * 0.08;
            matRef.current.size = 0.024 + Math.sin(state.clock.elapsedTime * 2.1) * 0.004;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                ref={matRef}
                size={0.025}
                color={theme.star}
                transparent
                opacity={isLight ? 0.28 : 0.35}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}

function PulseRings({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const rings = useRef<(Mesh | null)[]>([]);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const scroll = getScrollProgress();
        const charge = getCursorCharge();
        rings.current.forEach((mesh, i) => {
            if (!mesh) return;
            const phase = (t * (0.35 + charge * 0.15) + i * 0.4) % 2.4;
            const scale = 1 + phase * (1.8 + i * 0.3 + charge * 0.4);
            mesh.scale.setScalar(scale);
            const mat = mesh.material as THREE.MeshBasicMaterial;
            mat.opacity = Math.max(0, (0.12 + charge * 0.06) - phase * 0.05) * (1 - scroll * 0.3);
        });
    });

    return (
        <>
            {[0, 1, 2].map((i) => (
                <mesh
                    key={i}
                    ref={(el) => {
                        rings.current[i] = el;
                    }}
                    position={[0, -0.2, 0]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <ringGeometry args={[2.6 + i * 0.35, 2.75 + i * 0.35, 64]} />
                    <meshBasicMaterial
                        color={i % 2 === 0 ? theme.primary : theme.accent}
                        transparent
                        opacity={isLight ? 0.06 : 0.08}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </>
    );
}

function VelocityEmbers({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const { camera } = useThree();
    const ref = useRef<Points>(null);
    const matRef = useRef<THREE.PointsMaterial>(null);
    const spawnCooldown = useRef(0);
    const MAX = 48;
    const positions = useMemo(() => new Float32Array(MAX * 3), []);
    const pool = useRef(
        Array.from({ length: MAX }, () => ({
            active: false,
            age: 0,
            life: 0.6,
            x: 0,
            y: 0,
            z: 0,
            vx: 0,
            vy: 0,
            vz: 0,
        }))
    );

    useFrame((_, delta) => {
        const { speed, vx, vy } = getCursorVelocity();
        const { nx, ny } = getCursorPointer();
        const charge = getCursorCharge();
        spawnCooldown.current -= delta;

        if (speed > 0.03 && spawnCooldown.current <= 0) {
            spawnCooldown.current = 0.035;
            const head = ndcToWorld(nx, ny, camera, 3.2);
            const spawnCount = Math.min(3, Math.ceil(speed * 18));
            for (let n = 0; n < spawnCount; n++) {
                const slot = pool.current.find((p) => !p.active);
                if (!slot) break;
                slot.active = true;
                slot.age = 0;
                slot.life = 0.45 + Math.random() * 0.35;
                slot.x = head.x + (Math.random() - 0.5) * 0.35;
                slot.y = head.y + (Math.random() - 0.5) * 0.35;
                slot.z = head.z + (Math.random() - 0.5) * 0.35;
                slot.vx = -vx * 2.2 + (Math.random() - 0.5) * 0.6;
                slot.vy = -vy * 2.2 + (Math.random() - 0.5) * 0.6;
                slot.vz = (Math.random() - 0.5) * 0.35;
            }
        }

        for (let i = 0; i < MAX; i++) {
            const p = pool.current[i];
            const off = i * 3;
            if (!p.active) {
                positions[off] = 9999;
                positions[off + 1] = 9999;
                positions[off + 2] = 9999;
                continue;
            }
            p.age += delta;
            if (p.age >= p.life) {
                p.active = false;
                positions[off] = 9999;
                positions[off + 1] = 9999;
                positions[off + 2] = 9999;
                continue;
            }
            p.x += p.vx * delta * 4.5;
            p.y += p.vy * delta * 4.5;
            p.z += p.vz * delta * 4.5;
            positions[off] = p.x;
            positions[off + 1] = p.y;
            positions[off + 2] = p.z;
        }

        if (ref.current) {
            (ref.current.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
        }
        if (matRef.current) {
            matRef.current.size = 0.038 + speed * 0.035 + charge * 0.02;
            matRef.current.opacity = THREE.MathUtils.clamp(0.42 + speed * 0.45 + charge * 0.2, 0.42, 0.92);
            matRef.current.color.set(charge > 0.4 ? theme.warm : theme.accent);
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                ref={matRef}
                size={0.04}
                color={theme.accent}
                transparent
                opacity={0.5}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

function CursorWakeRing({ isLight }: { isLight: boolean }) {
    const theme = getSceneTheme(isLight);
    const ref = useRef<Mesh>(null);
    const { camera } = useThree();

    useFrame((state) => {
        if (!ref.current) return;
        const { speed } = getCursorVelocity();
        const { nx, ny } = getCursorPointer();
        if (speed < 0.018) {
            ref.current.visible = false;
            return;
        }
        ref.current.visible = true;
        ref.current.position.copy(ndcToWorld(nx, ny, camera, 3.4 + speed * 0.8));
        ref.current.rotation.x = Math.PI / 2;
        ref.current.rotation.z = state.clock.elapsedTime * 2.5;
        const scale = 0.12 + speed * 2.2;
        ref.current.scale.setScalar(scale);
        const mat = ref.current.material as THREE.MeshBasicMaterial;
        mat.opacity = THREE.MathUtils.clamp(speed * 0.75, 0.06, 0.28);
    });

    return (
        <mesh ref={ref} visible={false}>
            <ringGeometry args={[0.82, 1, 48]} />
            <meshBasicMaterial
                color={theme.accent}
                transparent
                opacity={0.12}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

export function SceneInteractions({ isLight }: { isLight: boolean }) {
    return (
        <>
            <TwinkleDeepStars isLight={isLight} />
            <AmbientPulseOrbs isLight={isLight} />
            <PulseRings isLight={isLight} />
            <PointerFollowLight />
            <AuroraRibbons isLight={isLight} />
            <FloatingGlyphs isLight={isLight} />
            <CrystalShards isLight={isLight} />
            <CursorGravityDust />
            <VelocityEmbers isLight={isLight} />
            <CursorWakeRing isLight={isLight} />
            <ConstellationWeb />
            <ChargeGlobeAura isLight={isLight} />
            <EnergyTether isLight={isLight} />
            <HoloScanSweep isLight={isLight} />
            <OrbitingMotes isLight={isLight} />
            <CursorSparkTrail />
            <BurstBeacon />
            <ClickShockwaves />
        </>
    );
}
