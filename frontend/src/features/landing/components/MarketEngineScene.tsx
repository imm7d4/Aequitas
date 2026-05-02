import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, MeshDistortMaterial, Environment, ContactShadows, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useScroll, useTransform } from 'framer-motion';

function Monolith({ scrollProgress }: { scrollProgress: any }) {
    const meshRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const lightRef = useRef<THREE.PointLight>(null);
    
    const rotationY = useTransform(scrollProgress, [0, 1], [0, Math.PI * 12]);
    const scale = useTransform(scrollProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [1, 1.8, 0.6, 2.5, 1.1, 4]);
    const explosion = useTransform(scrollProgress, [0.1, 0.35], [0, 3]);
    const colorShift = useTransform(scrollProgress, [0.4, 0.65], ["#00F0FF", "#D4AF37"]);
    const torusMode = useTransform(scrollProgress, [0.7, 0.95], [0, 1.5]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = rotationY.get() + t * 0.15;
            meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
            meshRef.current.scale.setScalar(scale.get());
        }
        
        if (coreRef.current) {
            coreRef.current.rotation.x = t * 0.5;
            coreRef.current.rotation.y = t * 0.8;
            coreRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
        }

        if (lightRef.current) {
            lightRef.current.intensity = 2 + Math.sin(t * 3) * 1;
            lightRef.current.position.y = Math.sin(t) * 2;
        }
    });

    const slices = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 16; i++) temp.push(i);
        return temp;
    }, []);

    return (
        <group ref={meshRef}>
            {slices.map((i) => (
                <Float key={i} speed={2} rotationIntensity={1} floatIntensity={0.5}>
                    <mesh position={[
                        0, 
                        (i - 7.5) * 0.25 * (1 + explosion.get()), 
                        Math.sin(i * 0.5 + torusMode.get() * 4) * torusMode.get() * 4
                    ]}
                    rotation={[0, (i * Math.PI) / 8 * torusMode.get(), 0]}
                    >
                        <boxGeometry args={[4, 0.05, 4]} />
                        <MeshDistortMaterial 
                            color={i % 4 === 0 ? colorShift.get() : "#080808"} 
                            speed={4} 
                            distort={0.1} 
                            radius={1}
                            metalness={1}
                            roughness={0}
                            transparent
                            opacity={0.8}
                        />
                    </mesh>
                </Float>
            ))}

            <mesh ref={coreRef}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial 
                    color={colorShift.get()} 
                    emissive={colorShift.get()} 
                    emissiveIntensity={5} 
                    wireframe
                />
            </mesh>

            <pointLight ref={lightRef} color={colorShift.get()} />
            <Sparkles count={100} scale={15} size={3} speed={1} color={colorShift.get()} />
        </group>
    );
}

function SceneContent() {
    const { scrollYProgress } = useScroll();
    const { camera } = useThree();
    
    // Smooth camera movement based on scroll
    const camZ = useTransform(scrollYProgress, [0, 1], [15, 8]);
    const camY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 5, -2]);
    const camRotX = useTransform(scrollYProgress, [0, 0.5, 1], [0, -0.2, 0.1]);

    useFrame(() => {
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, camZ.get(), 0.1);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, camY.get(), 0.1);
        camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, camRotX.get(), 0.1);
    });

    return (
        <>
            <PerspectiveCamera makeDefault fov={40} />
            <ambientLight intensity={0.3} />
            <spotLight position={[20, 20, 20]} angle={0.1} penumbra={1} intensity={2} castShadow />
            <Stars radius={150} depth={50} count={8000} factor={5} saturation={0} fade speed={2} />
            
            <Monolith scrollProgress={scrollYProgress} />
            
            {/* Temporarily disabled post-processing to fix crash 
            <EffectComposer>
                <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
                <Noise opacity={0.05} />
            </EffectComposer>
            */}

            <Environment preset="night" />
            <ContactShadows position={[0, -8, 0]} scale={40} blur={3} far={8} opacity={0.6} />
        </>
    );
}

export function MarketEngineScene() {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0,
            pointerEvents: 'none',
            background: '#020202'
        }}>
            <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <SceneContent />
            </Canvas>

            {/* Tactical Grid Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundSize: '80px 80px',
                backgroundImage: 'linear-gradient(to right, rgba(0, 240, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.04) 1px, transparent 1px)',
                pointerEvents: 'none',
                maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
            }} />

            {/* Scanline Effect */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02))',
                backgroundSize: '100% 4px, 3px 100%',
                pointerEvents: 'none',
                opacity: 0.3
            }} />
        </div>
    );
}
