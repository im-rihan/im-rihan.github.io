"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Mesh, Points } from "three";
import * as THREE from "three";

function CameraRig() {
    useFrame((state) => {
        const { pointer, camera } = state;
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.85, 0.04);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.55, 0.04);
        camera.lookAt(0, 0, 0);
    });
    return null;
}

function ParticleField() {
    const ref = useRef<Points>(null);
    const count = 1400;

    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 28;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 28;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 28;
        }
        return arr;
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime * 0.06;
        ref.current.rotation.y = t + state.pointer.x * 0.15;
        ref.current.rotation.x = Math.sin(t * 0.4) * 0.08 + state.pointer.y * 0.05;
        ref.current.position.x = state.pointer.x * 0.75;
        ref.current.position.y = state.pointer.y * 0.45;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.038}
                color="#14b8a6"
                transparent
                opacity={0.85}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}

function WireGlobe() {
    const ref = useRef<Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = state.clock.elapsedTime * 0.12 + state.pointer.x * 0.2;
        ref.current.rotation.x = 0.35 + state.pointer.y * 0.08;
        ref.current.position.x = state.pointer.x * 0.2;
        ref.current.position.y = state.pointer.y * 0.12;
    });

    return (
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
            <mesh ref={ref}>
                <icosahedronGeometry args={[2.2, 2]} />
                <meshBasicMaterial color="#0f766e" wireframe transparent opacity={0.2} />
            </mesh>
        </Float>
    );
}

function OrbitRing() {
    const ref = useRef<Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.z = state.clock.elapsedTime * 0.08;
        ref.current.rotation.x = Math.PI / 2.5 + state.pointer.y * 0.1;
        ref.current.position.x = state.pointer.x * 0.35;
    });

    return (
        <mesh ref={ref}>
            <torusGeometry args={[3.5, 0.015, 8, 64]} />
            <meshBasicMaterial color="#14b8a6" transparent opacity={0.4} />
        </mesh>
    );
}

function GridPlane() {
    const ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.x = -Math.PI / 2.2;
        ref.current.position.y = -4;
        ref.current.position.x = state.pointer.x * 0.35;
        ref.current.position.z = state.pointer.y * 0.22;
    });

    return (
        <mesh ref={ref}>
            <planeGeometry args={[32, 32, 40, 40]} />
            <meshBasicMaterial color="#0f766e" wireframe transparent opacity={0.1} />
        </mesh>
    );
}

export function SceneCanvas() {
    const [eventSource, setEventSource] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setEventSource(document.body);
    }, []);

    if (!eventSource) return null;

    return (
        <Canvas
            eventSource={eventSource}
            eventPrefix="client"
            camera={{ position: [0, 0, 9], fov: 55 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent" }}
        >
            <CameraRig />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.4} color="#14b8a6" />
            <Stars radius={80} depth={40} count={2200} factor={3.5} saturation={0} fade speed={0.5} />
            <ParticleField />
            <WireGlobe />
            <OrbitRing />
            <GridPlane />
        </Canvas>
    );
}
